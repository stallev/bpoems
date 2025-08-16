'use server';

import * as bcrypt from 'bcrypt';
import { prisma } from '@/shared/api/database/prisma';

type LoginData = {
  email: string;
  password: string;
};

export async function loginValidateAction(data: LoginData) {
  const { email, password } = data;

  // Валидация
  if (!email || !password) {
    throw new Error('Email и пароль обязательны');
  }

  // Проверка пользователя
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new Error('Неверный email или пароль');
  }

  // Проверка пароля
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Неверный email или пароль');
  }

  return { success: true, email }; // Возвращаем email для signIn на клиенте
}
