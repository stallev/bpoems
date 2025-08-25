'use server';

import { categoryRepository } from '@/entities/category';

export async function getCategories() {
  try {
    const categories = await categoryRepository.findActive();

    // Transform categories to the expected format
    const transformedCategories = categories.map(category => {
      const values = category.translatedName?.values as any;
      return {
        id: category.id,
        name: values?.EN || category.slug, // Fallback to slug if no translation
      };
    });

    return {
      success: true,
      categories: transformedCategories,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      message: 'Failed to fetch categories',
      categories: [],
    };
  }
}
