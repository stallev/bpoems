/**
 * Utility functions for generating and manipulating slugs
 */

// Cyrillic to Latin transliteration map
const transliterationMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  А: 'A',
  Б: 'B',
  В: 'V',
  Г: 'G',
  Д: 'D',
  Е: 'E',
  Ё: 'Yo',
  Ж: 'Zh',
  З: 'Z',
  И: 'I',
  Й: 'Y',
  К: 'K',
  Л: 'L',
  М: 'M',
  Н: 'N',
  О: 'O',
  П: 'P',
  Р: 'R',
  С: 'S',
  Т: 'T',
  У: 'U',
  Ф: 'F',
  Х: 'H',
  Ц: 'Ts',
  Ч: 'Ch',
  Ш: 'Sh',
  Щ: 'Sch',
  Ъ: '',
  Ы: 'Y',
  Ь: '',
  Э: 'E',
  Ю: 'Yu',
  Я: 'Ya',
};

/**
 * Transliterates Cyrillic characters to Latin
 */
export const transliterate = (text: string): string => {
  return text
    .split('')
    .map(char => transliterationMap[char] || char)
    .join('');
};

/**
 * Converts a string to a URL-friendly slug
 */
export const slugify = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Transliterate Cyrillic characters
  let slug = transliterate(text);

  // Convert to lowercase
  slug = slug.toLowerCase();

  // Replace spaces and special characters with hyphens
  slug = slug.replace(/[^a-z0-9\s-]/g, '');

  // Replace multiple spaces or hyphens with single hyphen
  slug = slug.replace(/[\s-]+/g, '-');

  // Remove leading and trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');

  // Limit length
  if (slug.length > 100) {
    slug = slug.substring(0, 100);
    // Remove trailing hyphen if it exists
    slug = slug.replace(/-+$/, '');
  }

  return slug;
};

/**
 * Generates a unique slug by appending a number if the base slug already exists
 */
export const generateUniqueSlug = async (
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

/**
 * Ensures a unique slug for a poem title using Prisma
 */
export const ensureUniqueSlug = async (title: string, prisma: any): Promise<string> => {
  const baseSlug = slugify(title);

  const checkExists = async (slug: string): Promise<boolean> => {
    const existingPoem = await prisma.poem.findUnique({
      where: { slug },
    });
    return !!existingPoem;
  };

  return generateUniqueSlug(baseSlug, checkExists);
};

/**
 * Ensures a unique slug for a category name using Prisma
 */
export const ensureUniqueCategorySlug = async (name: string, prisma: any): Promise<string> => {
  const baseSlug = slugify(name);

  const checkExists = async (slug: string): Promise<boolean> => {
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });
    return !!existingCategory;
  };

  return generateUniqueSlug(baseSlug, checkExists);
};

/**
 * Validates if a string is a valid slug
 */
export const isValidSlug = (slug: string): boolean => {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  // Check if slug matches the pattern: lowercase letters, numbers, hyphens only
  const slugPattern = /^[a-z0-9-]+$/;

  // Check length constraints
  if (slug.length < 1 || slug.length > 100) {
    return false;
  }

  // Check for consecutive hyphens
  if (slug.includes('--')) {
    return false;
  }

  // Check for leading or trailing hyphens
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return false;
  }

  return slugPattern.test(slug);
};

/**
 * Generate slug from English category name
 * @param englishName - English name of the category
 * @returns Generated slug
 */
export const generateCategorySlug = (englishName: string): string => {
  return slugify(englishName);
};

/**
 * Generate unique slug for category
 * @param englishName - English name of the category
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug
 */
export const generateUniqueCategorySlug = (
  englishName: string,
  existingSlugs: string[]
): string => {
  const baseSlug = generateCategorySlug(englishName);
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};
