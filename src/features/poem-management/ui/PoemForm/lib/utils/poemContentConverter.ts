// Define PoemContentBlock type locally to avoid import issues
interface PoemContentBlock {
  order: number;
  textType: 'paragraph' | 'image' | 'heading' | 'quote' | 'break';
  content: string;
  formatting: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    color?: string;
    backgroundColor?: string;
  } | null;
  emoji: string | null;
  altText: string | null;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  customStyles?: Record<string, unknown>;
}

// Convert Quill Delta to PoemContentBlock[]
export function convertQuillToPoemBlocks(quillContent: any): PoemContentBlock[] {
  if (!quillContent || !quillContent.ops) {
    return [];
  }

  const blocks: PoemContentBlock[] = [];
  let currentBlock: Partial<PoemContentBlock> = {
    order: 0,
    textType: 'paragraph',
    content: '',
    formatting: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
    },
    emoji: null,
    altText: null,
  };

  quillContent.ops.forEach((op: any) => {
    // Handle insert operations
    if (op.insert) {
      if (typeof op.insert === 'string') {
        // Text content
        if (op.insert === '\n') {
          // End of block
          if (currentBlock.content && currentBlock.content.trim()) {
            blocks.push(currentBlock as PoemContentBlock);
            currentBlock = {
              order: blocks.length,
              textType: 'paragraph',
              content: '',
              formatting: {
                bold: false,
                italic: false,
                underline: false,
                strikethrough: false,
              },
              emoji: null,
              altText: null,
            };
          }
        } else {
          // Regular text
          currentBlock.content += op.insert;

          // Apply formatting
          if (op.attributes) {
            currentBlock.formatting = {
              bold: op.attributes.bold || false,
              italic: op.attributes.italic || false,
              underline: op.attributes.underline || false,
              strikethrough: op.attributes.strike || false,
              color: op.attributes.color,
              backgroundColor: op.attributes.background,
            };
          }
        }
      } else if (op.insert.image) {
        // Image content
        if (currentBlock.content && currentBlock.content.trim()) {
          blocks.push(currentBlock as PoemContentBlock);
        }

        blocks.push({
          order: blocks.length,
          textType: 'image',
          content: '',
          formatting: null,
          emoji: null,
          altText: op.insert.image.alt || null,
          imageUrl: op.insert.image.src,
          imageWidth: op.insert.image.width,
          imageHeight: op.insert.image.height,
        });

        currentBlock = {
          order: blocks.length,
          textType: 'paragraph',
          content: '',
          formatting: {
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
          },
          emoji: null,
          altText: null,
        };
      } else if (op.insert.emoji) {
        // Emoji content
        currentBlock.emoji = op.insert.emoji;
      }
    }

    // Handle formatting attributes
    if (op.attributes) {
      if (op.attributes.header) {
        currentBlock.textType = 'heading';
      } else if (op.attributes.blockquote) {
        currentBlock.textType = 'quote';
      } else if (op.attributes.list) {
        // Handle lists as paragraphs for now
        currentBlock.textType = 'paragraph';
      }

      // Apply alignment
      if (op.attributes.align) {
        currentBlock.alignment = op.attributes.align;
      }

      // Apply font size
      if (op.attributes.size) {
        currentBlock.fontSize = getFontSizeFromQuill(op.attributes.size);
      }

      // Apply font family
      if (op.attributes.font) {
        currentBlock.fontFamily = op.attributes.font;
      }
    }
  });

  // Add the last block if it has content
  if (currentBlock.content && currentBlock.content.trim()) {
    blocks.push(currentBlock as PoemContentBlock);
  }

  return blocks;
}

// Convert PoemContentBlock[] to Quill Delta
export function convertPoemBlocksToQuill(blocks: PoemContentBlock[]): any {
  const ops: any[] = [];

  blocks.forEach((block, index) => {
    if (index > 0) {
      ops.push({ insert: '\n' });
    }

    if (block.textType === 'image' && block.imageUrl) {
      ops.push({
        insert: {
          image: {
            src: block.imageUrl,
            alt: block.altText || '',
            width: block.imageWidth,
            height: block.imageHeight,
          },
        },
      });
    } else if (block.textType === 'break') {
      ops.push({ insert: '\n' });
    } else {
      // Text content
      if (block.content) {
        const attributes: any = {};

        // Apply formatting
        if (block.formatting) {
          if (block.formatting.bold) attributes.bold = true;
          if (block.formatting.italic) attributes.italic = true;
          if (block.formatting.underline) attributes.underline = true;
          if (block.formatting.strikethrough) attributes.strike = true;
          if (block.formatting.color) attributes.color = block.formatting.color;
          if (block.formatting.backgroundColor)
            attributes.background = block.formatting.backgroundColor;
        }

        // Apply text type
        if (block.textType === 'heading') {
          attributes.header = 1;
        } else if (block.textType === 'quote') {
          attributes.blockquote = true;
        }

        // Apply alignment
        if (block.alignment) {
          attributes.align = block.alignment;
        }

        // Apply font size
        if (block.fontSize) {
          attributes.size = getQuillSizeFromFontSize(block.fontSize);
        }

        // Apply font family
        if (block.fontFamily) {
          attributes.font = block.fontFamily;
        }

        ops.push({
          insert: block.content,
          attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
        });
      }

      // Add emoji if present
      if (block.emoji) {
        ops.push({
          insert: { emoji: block.emoji },
        });
      }
    }
  });

  return { ops };
}

// Helper function to convert Quill font size to numeric value
function getFontSizeFromQuill(size: string): number {
  const sizeMap: Record<string, number> = {
    small: 12,
    large: 18,
    huge: 24,
  };
  return sizeMap[size] || 14;
}

// Helper function to convert numeric font size to Quill size
function getQuillSizeFromFontSize(size: number): string {
  if (size <= 12) return 'small';
  if (size >= 24) return 'huge';
  if (size >= 18) return 'large';
  return 'normal';
}

// Validate poem content
export function validatePoemContent(blocks: PoemContentBlock[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!blocks || blocks.length === 0) {
    errors.push('Content is required');
    return { isValid: false, errors };
  }

  const textContent = blocks
    .filter(
      block =>
        block.textType === 'paragraph' || block.textType === 'heading' || block.textType === 'quote'
    )
    .map(block => block.content)
    .join(' ')
    .trim();

  if (textContent.length < 10) {
    errors.push('Content must be at least 10 characters long');
  }

  const imageBlocks = blocks.filter(block => block.textType === 'image');
  if (imageBlocks.length > 5) {
    errors.push('Maximum 5 images allowed');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Sanitize poem content
export function sanitizePoemContent(blocks: PoemContentBlock[]): PoemContentBlock[] {
  return blocks
    .map(block => ({
      ...block,
      content: block.content.trim(),
      altText: block.altText?.trim() || null,
      emoji: block.emoji?.trim() || null,
    }))
    .filter(
      block =>
        block.content || block.textType === 'image' || block.textType === 'break' || block.emoji
    );
}
