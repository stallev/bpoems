/**
 * Utility functions for poem content processing and validation
 *
 * @module poem-creation/lib/utils
 */

/**
 * Convert Tiptap JSON to PoemContentBlock array
 *
 * @example
 * ```typescript
 * import { tiptapJsonToPoemContentBlocks } from '@/features/poem-creation/lib/utils';
 *
 * const json = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello World' }] }] };
 * const blocks = tiptapJsonToPoemContentBlocks(json);
 * ```
 */
export {
  tiptapJsonToPoemContentBlocks,
  poemContentBlocksToTiptapJson,
  sanitizeContent,
  validatePoemContentBlocks,
} from './tiptapUtils';
