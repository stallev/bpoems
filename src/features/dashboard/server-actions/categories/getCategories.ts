'use server';

import { categoryRepository } from '@/entities/category';
import { CATEGORY_ERRORS } from '@/entities/category/constants';
import { CategoryWithTranslation, CategoryStats } from '@/entities/category/model/types';
import { auth } from '@/shared/api/auth/auth';

type GetCategoriesResult =
  | { success: true; data: { categories: CategoryWithTranslation[]; stats: CategoryStats } }
  | { success: false; message: string; data?: never };

export async function getCategories(
  filter?: 'all' | 'active' | 'inactive'
): Promise<GetCategoriesResult> {
  try {
    // Проверка авторизации и прав доступа
    const session = await auth();
    if (!session?.user) {
      throw new Error(CATEGORY_ERRORS.ACCESS_DENIED);
    }

    if (!['ADMIN', 'MODERATOR'].includes(session.user.role)) {
      throw new Error(CATEGORY_ERRORS.MODERATOR_REQUIRED);
    }

    // Получение категорий с фильтрацией
    const categories = await categoryRepository.findForDashboard({ filter });
    const stats = await categoryRepository.getStats();

    return {
      success: true,
      data: {
        categories,
        stats,
      },
    };
  } catch (error) {
    console.error('Error getting categories:', error);

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
