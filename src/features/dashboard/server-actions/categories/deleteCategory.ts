'use server';

import { revalidatePath } from 'next/cache';
import { categoryRepository } from '@/entities/category';
import { CATEGORY_ERRORS, CATEGORY_SUCCESS } from '@/entities/category/constants';
import { auth } from '@/shared/api/auth/auth';

export async function deleteCategory(id: string) {
  try {
    // Проверка авторизации и прав доступа
    const session = await auth();
    if (!session?.user) {
      throw new Error(CATEGORY_ERRORS.ACCESS_DENIED);
    }

    if (session.user.role !== 'ADMIN') {
      throw new Error(CATEGORY_ERRORS.ACCESS_DENIED);
    }

    // Проверка существования категории
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error(CATEGORY_ERRORS.NOT_FOUND);
    }

    // Удаление категории
    await categoryRepository.delete(id);

    // Ревалидация кэша
    revalidatePath('/dashboard/content/categories');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: CATEGORY_SUCCESS.DELETED,
    };
  } catch (error) {
    console.error('Error deleting category:', error);

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
