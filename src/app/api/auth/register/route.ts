import * as bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { signIn } from 'next-auth/react'; // Для автоматического входа после регистрации
import { prisma } from '@/shared/api/database/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Валидация
    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Пароль должен быть не менее 8 символов' },
        { status: 400 }
      );
    }

    // Проверка существования пользователя
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email уже зарегистрирован' }, { status: 409 });
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя (роль по умолчанию SUBSCRIBER из schema)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Автоматический вход после регистрации
    const signInResult = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (signInResult?.error) {
      return NextResponse.json({ error: 'Ошибка входа после регистрации' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Регистрация успешна', user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
