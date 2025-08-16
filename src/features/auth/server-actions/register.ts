'use server';

import * as bcrypt from 'bcrypt';
import { prisma } from '@/shared/api/database/prisma';

type RegisterData = {
  name?: string;
  email: string;
  password: string;
};

export async function registerAction(data: RegisterData) {
  const { name, email, password } = data;

  // Валидация
  if (!email || !password) {
    throw new Error('Email и пароль обязательны');
  }
  if (password.length < 8) {
    throw new Error('Пароль должен быть не менее 8 символов');
  }

  // Проверка существования пользователя
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email уже зарегистрирован');
  }

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

  return { success: true, email }; // Возвращаем email для последующего signIn на клиенте
}
