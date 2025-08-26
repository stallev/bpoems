/**
 * Server Actions for poem creation and management
 *
 * @module poem-creation/server-actions
 */

/**
 * Create a new poem
 *
 * @example
 * ```typescript
 * import { createPoem } from '@/features/poem-creation/server-actions';
 *
 * const result = await createPoem(formData);
 * if (result.success) {
 *   console.log('Poem created:', result.data);
 * }
 * ```
 */
export { createPoem } from './createPoem';

/**
 * Update an existing poem
 *
 * @example
 * ```typescript
 * import { updatePoem } from '@/features/poem-creation/server-actions';
 *
 * const result = await updatePoem(poemId, formData);
 * if (result.success) {
 *   console.log('Poem updated:', result.data);
 * }
 * ```
 */
export { updatePoem } from './updatePoem';

/**
 * Get categories for poem form
 *
 * @example
 * ```typescript
 * import { getCategoriesForPoem } from '@/features/poem-creation/server-actions';
 *
 * const categories = await getCategoriesForPoem();
 * ```
 */
export { getCategories } from './getCategories';
