'use server';

import { revalidatePath } from 'next/cache';
import { categoryRepository } from '@/entities/category';
import { CATEGORY_ERRORS, CATEGORY_SUCCESS } from '@/entities/category/constants';
import { auth } from '@/shared/api/auth/auth';
import { prisma } from '@/shared/api/database/prisma';

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
    const translations = {
      EN: formData.get('translations.EN') as string,
      RU: formData.get('translations.RU') as string,
      UA: formData.get('translations.UA') as string,
    };

    const rawData = {
      isActive: formData.get('isActive') === 'true',
      order: formData.get('order') ? Number(formData.get('order')) : undefined,
    };

    // Проверка обязательных полей
    if (!translations.EN || !translations.RU || !translations.UA) {
      throw new Error(CATEGORY_ERRORS.NAME_REQUIRED);
    }

    if (translations.EN.length < 2) {
      throw new Error(CATEGORY_ERRORS.NAME_TOO_SHORT);
    }

    if (translations.EN.length > 50) {
      throw new Error(CATEGORY_ERRORS.NAME_TOO_LONG);
    }

    // Проверка уникальности названия (исключая текущую категорию)
    const exists = await categoryRepository.existsByName(translations.EN, 'EN', id);
    if (exists) {
      throw new Error(CATEGORY_ERRORS.NAME_EXISTS_EN);
    }

    // Обновление категории
    const category = await categoryRepository.update(id, rawData);

    // Обновление переводов
    const translatedItem = await prisma.translatedItem.findFirst({
      where: {
        categoryId: id,
        type: 'POEM_CATEGORY',
      },
    });

    if (translatedItem) {
      await prisma.translatedItem.update({
        where: { id: translatedItem.id },
        data: {
          values: translations,
        },
      });
    }

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
