'use server';

import { revalidatePath } from 'next/cache';
import { categoryRepository } from '@/entities/category';
import { CATEGORY_ERRORS, CATEGORY_SUCCESS } from '@/entities/category/constants';
import { auth } from '@/shared/api/auth/auth';

export async function updateCategory(id: string, formData: FormData) {
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

    // Парсинг и валидация данных
    const rawData = {
      translations: {
        EN: formData.get('translations.EN') as string,
        RU: formData.get('translations.RU') as string,
        UA: formData.get('translations.UA') as string,
      },
      isActive: formData.get('isActive') === 'true',
      order: formData.get('order') ? Number(formData.get('order')) : undefined,
    };

    // Проверка обязательных полей
    if (!rawData.translations.EN || !rawData.translations.RU || !rawData.translations.UA) {
      throw new Error(CATEGORY_ERRORS.NAME_REQUIRED);
    }

    if (rawData.translations.EN.length < 2) {
      throw new Error(CATEGORY_ERRORS.NAME_TOO_SHORT);
    }

    if (rawData.translations.EN.length > 50) {
      throw new Error(CATEGORY_ERRORS.NAME_TOO_LONG);
    }

    // Проверка уникальности названия (исключая текущую категорию)
    const exists = await categoryRepository.existsByName(rawData.translations.EN, 'EN', id);
    if (exists) {
      throw new Error(CATEGORY_ERRORS.NAME_EXISTS_EN);
    }

    // Обновление категории
    const category = await categoryRepository.update(id, rawData);

    // Ревалидация кэша
    revalidatePath('/dashboard/content/categories');
    revalidatePath(`/dashboard/content/categories/${id}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      message: CATEGORY_SUCCESS.UPDATED,
      data: category,
    };
  } catch (error) {
    console.error('Error updating category:', error);

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
