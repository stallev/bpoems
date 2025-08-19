'use server'; // Indicates server action

import * as bcrypt from 'bcrypt';
import { prisma } from '@/shared/api/database/prisma';
import { AuthErrors } from '@/shared/constants/Errors';

type LoginData = {
  email: string;
  password: string;
};

type LoginResult = { success: true; email: string } | { success: false; error: string };

export async function loginValidateAction(data: LoginData): Promise<LoginResult> {
  const { email, password } = data;

  // Validation
  if (!email || !password) {
    return { success: false, error: AuthErrors.EMAIL_AND_PASSWORD_REQUIRED };
  }

  // Check user
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return { success: false, error: AuthErrors.INVALID_EMAIL_OR_PASSWORD };
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: AuthErrors.INVALID_EMAIL_OR_PASSWORD };
    }
  } catch (error) {
    console.error('Unexpected error in loginValidateAction:', error);
    return { success: false, error: AuthErrors.INTERNAL_SERVER_ERROR };
  }

  return { success: true, email };
}
