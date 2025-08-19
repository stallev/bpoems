// Example of using category entity
import { categoryRepository, DEFAULT_CATEGORIES } from '@/entities/category';
import type { CreateCategoryData, TranslationValues } from '@/entities/category';

// Example 1: Creating a new category
export async function createNewCategory() {
  const newCategoryData: CreateCategoryData = {
    translations: {
      EN: 'Nature Poetry',
      RU: 'Поэзия о природе',
      UA: 'Поезія про природу',
    },
    isActive: true,
    order: 7,
  };

  try {
    const newCategory = await categoryRepository.create(newCategoryData);
    console.log('New category created:', newCategory.id);
    return newCategory;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

// Example 2: Getting all active categories
export async function getActiveCategories() {
  try {
    const activeCategories = await categoryRepository.findActive();
    console.log('Active categories:', activeCategories.length);
    return activeCategories;
  } catch (error) {
    console.error('Error getting active categories:', error);
    throw error;
  }
}

// Example 3: Updating a category
export async function updateCategory(categoryId: string) {
  const updateData = {
    translations: {
      EN: 'Updated Nature Poetry',
      RU: 'Обновленная поэзия о природе',
      UA: 'Оновлена поезія про природу',
    },
    isActive: false,
  };

  try {
    const updatedCategory = await categoryRepository.update(categoryId, updateData);
    console.log('Category updated:', updatedCategory.id);
    return updatedCategory;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

// Example 4: Getting categories for dashboard
export async function getCategoriesForDashboard() {
  try {
    const dashboardCategories = await categoryRepository.findForDashboard({
      includeInactive: true,
    });
    console.log('Categories for dashboard:', dashboardCategories.length);
    return dashboardCategories;
  } catch (error) {
    console.error('Error getting categories for dashboard:', error);
    throw error;
  }
}

// Example 5: Checking if category exists by name
export async function checkCategoryExists(name: string, locale: keyof TranslationValues = 'EN') {
  try {
    const exists = await categoryRepository.existsByName(name, locale);
    console.log(`Category with name "${name}" (${locale}):`, exists ? 'exists' : 'does not exist');
    return exists;
  } catch (error) {
    console.error('Error checking category existence:', error);
    throw error;
  }
}

// Example 6: Getting category statistics
export async function getCategoryStats() {
  try {
    const categoriesWithStats = await categoryRepository.findWithStats();
    console.log('Category statistics:');
    categoriesWithStats.forEach(category => {
      console.log(`- ${category.translatedName.values}: ${category.poemCount} poems`);
    });
    return categoriesWithStats;
  } catch (error) {
    console.error('Error getting statistics:', error);
    throw error;
  }
}

// Example 7: Initializing default categories
export async function initializeDefaultCategories() {
  try {
    console.log('Initializing default categories...');

    for (const defaultCategory of DEFAULT_CATEGORIES) {
      // Check if category with this name already exists
      const exists = await categoryRepository.existsByName(defaultCategory.translations.EN, 'EN');

      if (!exists) {
        await categoryRepository.create({
          translations: defaultCategory.translations,
          order: defaultCategory.order,
          isActive: true,
        });
        console.log(`Category created: ${defaultCategory.translations.EN}`);
      } else {
        console.log(`Category already exists: ${defaultCategory.translations.EN}`);
      }
    }

    console.log('Initialization completed');
  } catch (error) {
    console.error('Error initializing default categories:', error);
    throw error;
  }
}

// Example 8: Managing category order
export async function reorderCategories() {
  try {
    // Get all categories
    const categories = await categoryRepository.findAll();

    // Update order (e.g., move first category to the end)
    if (categories.length > 1) {
      const firstCategory = categories[0];

      // Get next order number
      const nextOrder = await categoryRepository.getNextOrder();

      // Update first category order
      await categoryRepository.updateOrder(firstCategory.id, nextOrder);
      console.log(`Category "${firstCategory.translatedName.values}" moved to the end`);
    }
  } catch (error) {
    console.error('Error changing category order:', error);
    throw error;
  }
}
