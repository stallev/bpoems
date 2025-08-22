'use server';

import { revalidatePath } from 'next/cache';
import { categoryRepository } from '@/entities/category';
import { CATEGORY_ERRORS, CATEGORY_SUCCESS } from '@/entities/category/constants';
import { auth } from '@/shared/api/auth/auth';

export async function toggleCategoryStatus(id: string, isActive: boolean) {
  try {
    // Проверка авторизации и прав доступа
    const session = await auth();
    if (!session?.user) {
      throw new Error(CATEGORY_ERRORS.ACCESS_DENIED);
    }

    if (!['ADMIN', 'MODERATOR'].includes(session.user.role)) {
      throw new Error(CATEGORY_ERRORS.MODERATOR_REQUIRED);
    }

    // Проверка существования категории
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error(CATEGORY_ERRORS.NOT_FOUND);
    }

    // Изменение статуса
    if (isActive) {
      await categoryRepository.activate(id);
    } else {
      await categoryRepository.deactivate(id);
    }

    // Ревалидация кэша
    revalidatePath('/dashboard/content/categories');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: isActive ? CATEGORY_SUCCESS.ACTIVATED : CATEGORY_SUCCESS.DEACTIVATED,
    };
  } catch (error) {
    console.error('Error toggling category status:', error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: CATEGORY_ERRORS.UNKNOWN_ERROR,
    };
  }
}
