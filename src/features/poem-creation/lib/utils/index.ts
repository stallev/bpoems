/**
 * Utility functions for poem content processing and validation
 *
 * @module poem-creation/lib/utils
 */

/**
 * Convert Quill Delta to PoemContentBlock array
 *
 * @example
 * ```typescript
 * import { deltaToPoemContentBlocks } from '@/features/poem-creation/lib/utils';
 *
 * const delta = { ops: [{ insert: 'Hello\nWorld', attributes: { bold: true } }] };
 * const blocks = deltaToPoemContentBlocks(delta);
 * ```
 */
export {
  deltaToPoemContentBlocks,
  poemContentBlocksToDelta,
  sanitizeContent,
  validatePoemContentBlocks,
} from './quillUtils';
