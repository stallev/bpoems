import type { QuillDelta } from '../../model/types';

/**
 * Converts Quill Delta to poem content blocks
 */
export const deltaToPoemContentBlocks = (delta: QuillDelta): any[] => {
  if (!delta.ops || delta.ops.length === 0) {
    return [];
  }

  const blocks: any[] = [];

  for (const op of delta.ops) {
    if (typeof op.insert === 'string') {
      const text = op.insert;

      // Split text by newlines to create separate blocks
      const lines = text.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.length > 0) {
          // Create new text block
          const block = {
            order: blocks.length,
            textType: 'paragraph' as const,
            content: line,
            formatting: op.attributes
              ? {
                  bold: Boolean(op.attributes.bold),
                  italic: Boolean(op.attributes.italic),
                  underline: Boolean(op.attributes.underline),
                }
              : null,
          };
          blocks.push(block);
        }
      }
    }
  }

  return blocks;
};

/**
 * Converts poem content blocks to Quill Delta
 */
export const poemContentBlocksToDelta = (blocks: any[]): QuillDelta => {
  const ops: Array<{
    insert: string;
    attributes?: {
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
    };
  }> = [];

  for (const block of blocks) {
    if (block.content.trim().length > 0) {
      const attributes: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
      } = {};

      if (block.formatting) {
        if (block.formatting.bold) attributes.bold = true;
        if (block.formatting.italic) attributes.italic = true;
        if (block.formatting.underline) attributes.underline = true;
      }

      ops.push({
        insert: block.content + '\n',
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      });
    }
  }

  return { ops };
};

/**
 * Sanitizes poem content blocks for safe storage
 */
export const sanitizePoemContentBlocks = (blocks: any[]): any[] => {
  return blocks.map(block => ({
    ...block,
    content: block.content.trim(),
    formatting: block.formatting || null,
  }));
};

/**
 * Validates poem content blocks
 */
export const validatePoemContentBlocks = (blocks: any[]): boolean => {
  if (!Array.isArray(blocks)) {
    return false;
  }

  for (const block of blocks) {
    if (!block.textType || block.textType !== 'paragraph') {
      return false;
    }

    if (typeof block.content !== 'string') {
      return false;
    }

    if (typeof block.order !== 'number' || block.order < 0) {
      return false;
    }

    if (block.formatting && typeof block.formatting !== 'object') {
      return false;
    }
  }

  return true;
};

/**
 * Sanitizes content for safe storage
 */
export const sanitizeContent = (content: string): string => {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Remove HTML tags
  const withoutHtml = content.replace(/<[^>]*>/g, '');

  // Remove excessive whitespace
  const cleaned = withoutHtml.replace(/\s+/g, ' ').trim();

  return cleaned;
};
