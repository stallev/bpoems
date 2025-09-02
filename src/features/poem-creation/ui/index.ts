/**
 * UI components for poem creation and editing
 *
 * @module poem-creation/ui
 */

/**
 * Main form component for creating and editing poems
 *
 * @example
 * ```tsx
 * import { PoemForm } from '@/features/poem-creation/ui';
 *
 * <PoemForm
 *   categories={categories}
 *   onSuccess={(data) => router.push(`/poems/${data.slug}`)}
 * />
 * ```
 */
export { PoemForm } from './PoemForm';
export { PoemFormWrapper } from './PoemFormWrapper';
