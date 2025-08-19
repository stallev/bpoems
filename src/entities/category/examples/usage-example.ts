// Пример использования entity category
import { categoryRepository, DEFAULT_CATEGORIES } from '@/entities/category';
import type { CreateCategoryData, TranslationValues } from '@/entities/category';

// Пример 1: Создание новой категории
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
    console.log('Новая категория создана:', newCategory.id);
    return newCategory;
  } catch (error) {
    console.error('Ошибка при создании категории:', error);
    throw error;
  }
}

// Пример 2: Получение всех активных категорий
export async function getActiveCategories() {
  try {
    const activeCategories = await categoryRepository.findActive();
    console.log('Активные категории:', activeCategories.length);
    return activeCategories;
  } catch (error) {
    console.error('Ошибка при получении активных категорий:', error);
    throw error;
  }
}

// Пример 3: Обновление категории
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
    console.log('Категория обновлена:', updatedCategory.id);
    return updatedCategory;
  } catch (error) {
    console.error('Ошибка при обновлении категории:', error);
    throw error;
  }
}

// Пример 4: Получение категорий для dashboard
export async function getCategoriesForDashboard() {
  try {
    const dashboardCategories = await categoryRepository.findForDashboard({
      includeInactive: true,
    });
    console.log('Категории для dashboard:', dashboardCategories.length);
    return dashboardCategories;
  } catch (error) {
    console.error('Ошибка при получении категорий для dashboard:', error);
    throw error;
  }
}

// Пример 5: Проверка существования категории по названию
export async function checkCategoryExists(name: string, locale: keyof TranslationValues = 'EN') {
  try {
    const exists = await categoryRepository.existsByName(name, locale);
    console.log(
      `Категория с названием "${name}" (${locale}):`,
      exists ? 'существует' : 'не существует'
    );
    return exists;
  } catch (error) {
    console.error('Ошибка при проверке существования категории:', error);
    throw error;
  }
}

// Пример 6: Получение статистики по категориям
export async function getCategoryStats() {
  try {
    const categoriesWithStats = await categoryRepository.findWithStats();
    console.log('Статистика по категориям:');
    categoriesWithStats.forEach(category => {
      console.log(`- ${category.translatedName.values}: ${category.poemCount} стихов`);
    });
    return categoriesWithStats;
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    throw error;
  }
}

// Пример 7: Инициализация дефолтных категорий
export async function initializeDefaultCategories() {
  try {
    console.log('Инициализация дефолтных категорий...');

    for (const defaultCategory of DEFAULT_CATEGORIES) {
      // Проверяем, существует ли уже категория с таким названием
      const exists = await categoryRepository.existsByName(defaultCategory.translations.EN, 'EN');

      if (!exists) {
        await categoryRepository.create({
          translations: defaultCategory.translations,
          order: defaultCategory.order,
          isActive: true,
        });
        console.log(`Создана категория: ${defaultCategory.translations.EN}`);
      } else {
        console.log(`Категория уже существует: ${defaultCategory.translations.EN}`);
      }
    }

    console.log('Инициализация завершена');
  } catch (error) {
    console.error('Ошибка при инициализации дефолтных категорий:', error);
    throw error;
  }
}

// Пример 8: Управление порядком категорий
export async function reorderCategories() {
  try {
    // Получаем все категории
    const categories = await categoryRepository.findAll();

    // Обновляем порядок (например, перемещаем первую категорию в конец)
    if (categories.length > 1) {
      const firstCategory = categories[0];

      // Получаем следующий порядковый номер
      const nextOrder = await categoryRepository.getNextOrder();

      // Обновляем порядок первой категории
      await categoryRepository.updateOrder(firstCategory.id, nextOrder);
      console.log(`Категория "${firstCategory.translatedName.values}" перемещена в конец`);
    }
  } catch (error) {
    console.error('Ошибка при изменении порядка категорий:', error);
    throw error;
  }
}
