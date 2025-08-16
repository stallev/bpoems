'use server'; // Indicates server action

import * as bcrypt from 'bcrypt';
import { prisma } from '@/shared/api/database/prisma';
import { AuthErrors } from '@/shared/constants/Errors';

type RegisterData = {
  name?: string;
  email: string;
  password: string;
};

type RegisterResult = { success: true; email: string } | { success: false; error: string };

export async function registerAction(data: RegisterData): Promise<RegisterResult> {
  const { name, email, password } = data;

  // Validation
  if (!email || !password) {
    return { success: false, error: AuthErrors.EMAIL_AND_PASSWORD_REQUIRED };
  }
  if (password.length < 8) {
    return { success: false, error: AuthErrors.PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: AuthErrors.EMAIL_ALREADY_REGISTERED };
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
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
    return { success: false, error: AuthErrors.INTERNAL_SERVER_ERROR };
  }
}
