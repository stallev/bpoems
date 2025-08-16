'use server'; // Обозначает server action

import * as bcrypt from 'bcrypt';
import { prisma } from '@/shared/api/database/prisma';

type RegisterData = {
  name?: string;
  email: string;
  password: string;
};

type RegisterResult = { success: true; email: string } | { success: false; error: string };

export async function registerAction(data: RegisterData): Promise<RegisterResult> {
  const { name, email, password } = data;

  // Валидация
  if (!email || !password) {
    return { success: false, error: 'Email и пароль обязательны' };
  }
  if (password.length < 8) {
    return { success: false, error: 'Пароль должен быть не менее 8 символов' };
  }

  // Проверка существования пользователя
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: 'Email уже зарегистрирован' };
  }

  try {
    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true, email };
  } catch (error) {
    console.error('Unexpected error in registerAction:', error);
    return { success: false, error: 'Внутренняя ошибка сервера' };
  }
}
