'use server';

import { categoryRepository } from '@/entities/category';
import type { CategoryWithRelations } from '@/entities/category/model/types';
import { auth } from '@/shared/api/auth/auth';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { canCreateContent } from '@/shared/lib/utils/roleUtils';
import { POEM_ERRORS } from '../lib/constants';

type GetCategoriesResult =
  | {
      success: true;
      data: Array<{
        id: string;
        translatedItems: Array<{ id: string; type: string; values: any }>;
      }>;
    }
  | { success: false; message: string; data?: never };

export async function getCategories(): Promise<GetCategoriesResult> {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user) {
      throw new Error(POEM_ERRORS.ACCESS_DENIED);
    }

    // 2. Authorization check - allow SUBSCRIBER, AUTHOR, MODERATOR, ADMIN
    if (!canCreateContent(session.user.role)) {
      throw new Error(POEM_ERRORS.INSUFFICIENT_PERMISSIONS);
    }

    // 3. Get active categories
    const categories = await categoryRepository.findAll({ where: { isActive: true } });

    // 4. Transform categories for form display
    const categoryOptions = categories.map((category: CategoryWithRelations) => {
      return {
        id: category.id,
        translatedItems: category.translatedItems,
      };
    });

    return {
      success: true,
      data: categoryOptions,
    };
  } catch (error) {
    console.error(ErrorMessages.GET_CATEGORIES_FAILED, error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: POEM_ERRORS.UNKNOWN_ERROR,
    };
  }
}
