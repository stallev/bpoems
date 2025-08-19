import * as bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { signIn } from 'next-auth/react'; // Используем встроенный signIn
import { prisma } from '@/shared/api/database/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Валидация
    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
    }

    // Проверка пользователя
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
    }

    // Вызов signIn для создания сессии
    const signInResult = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (signInResult?.error) {
      return NextResponse.json({ error: 'Ошибка входа' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Вход успешен', user: { id: user.id, email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка входа:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
