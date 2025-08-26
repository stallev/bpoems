/**
 * Custom hooks for poem creation and editing
 *
 * @module poem-creation/lib/hooks
 */

/**
 * Hook for managing poem form state and operations
 *
 * @example
 * ```tsx
 * import { usePoemForm } from '@/features/poem-creation/lib/hooks';
 *
 * const { form, handleSubmit, resetForm, getQuillValue } = usePoemForm({
 *   defaultValues: { title: 'My Poem' },
 *   onSuccess: (data) => router.push(`/poems/${data.slug}`)
 * });
 * ```
 */
export { usePoemForm } from './usePoemForm';
