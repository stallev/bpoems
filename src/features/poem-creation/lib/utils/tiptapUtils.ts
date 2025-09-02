import type { PoemContentBlock, TiptapJson, TiptapContent } from '../../model/types';

/**
 * Converts Tiptap JSON or PoemContentBlock array to poem content blocks
 */
export const tiptapJsonToPoemContentBlocks = (json: TiptapContent): PoemContentBlock[] => {
  console.log('json tiptapJsonToPoemContentBlocks', json);

  // If json is already an array of PoemContentBlock, return it directly
  if (Array.isArray(json)) {
    console.log('json is already PoemContentBlock array');
    return json;
  }

  if (Array.isArray(json.content)) {
    if (json.content.length !== 0) {
      json.content.map(item => {
        if (item.type === 'paragraph' && !item?.content) {
          item.content = [{ type: 'text', text: '' }];
        }
        return item;
      });
    }
  }

  console.log('json.content', json.content);

  // If json is TiptapJson object, process it
  if (json && typeof json === 'object' && 'content' in json) {
    // Handle empty content array - create a single empty paragraph
    if (!json.content || !Array.isArray(json.content) || json.content.length === 0) {
      console.log('json.content is empty, creating empty paragraph');
      return [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '' }],
          order: 0,
        },
      ];
    }

    const blocks: PoemContentBlock[] = [];
    let order = 0;

    for (const node of json.content) {
      // Support for paragraph, heading, bulletList, and orderedList
      if (
        (node.type === 'paragraph' ||
          node.type === 'heading' ||
          node.type === 'bulletList' ||
          node.type === 'orderedList') &&
        node.content
      ) {
        const contentBlocks: Array<{
          type: 'text';
          text: string;
          marks?: Array<{
            type: 'bold' | 'italic' | 'underline' | 'strike';
            attrs?: Record<string, unknown>;
          }>;
        }> = [];

        // Process content recursively for nested lists
        const processContent = (
          content: Array<{
            type: string;
            text?: string;
            marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
            content?: Array<{
              type: string;
              text?: string;
              marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
            }>;
          }>
        ): void => {
          console.log('processContent', content);
          for (const textNode of content) {
            if (textNode.type === 'text' && textNode.text !== undefined) {
              contentBlocks.push({
                type: 'text',
                text: textNode.text,
                marks: textNode.marks?.map(mark => ({
                  type: mark.type as 'bold' | 'italic' | 'underline' | 'strike',
                  attrs: mark.attrs,
                })),
              });
            } else if (textNode.type === 'listItem' && textNode.content) {
              // Process list items recursively
              processContent(textNode.content);
            }
          }
        };

        processContent(node.content);

        // Always add a block, even if it's empty (for empty paragraphs)
        blocks.push({
          type: 'paragraph',
          content: contentBlocks.length > 0 ? contentBlocks : [{ type: 'text', text: '' }],
          order,
        });
        order++;
      }
    }

    console.log('blocks tiptapJsonToPoemContentBlocks', blocks);
    return blocks;
  }

  // If json is neither array nor valid TiptapJson object, return empty array
  console.log('json is neither array nor valid TiptapJson object');
  return [];
};

/**
 * Converts poem content blocks to Tiptap JSON
 */
export const poemContentBlocksToTiptapJson = (blocks: PoemContentBlock[]): TiptapJson => {
  const content = blocks.map(block => ({
    type: 'paragraph',
    content:
      block.content.length > 0
        ? block.content.map(textBlock => ({
            type: 'text',
            text: textBlock.text,
            marks: textBlock.marks?.map(mark => ({
              type: mark.type,
              attrs: mark.attrs,
            })),
          }))
        : [{ type: 'text', text: '' }],
  }));

  return {
    type: 'doc',
    content,
  };
};

/**
 * Sanitizes poem content blocks for safe storage
 */
export const sanitizePoemContentBlocks = (blocks: PoemContentBlock[]): PoemContentBlock[] => {
  return blocks.map(block => ({
    ...block,
    content: block.content.map(textBlock => ({
      ...textBlock,
      text: textBlock.text.trim(),
    })),
  }));
};

/**
 * Validates poem content blocks
 */
export const validatePoemContentBlocks = (blocks: PoemContentBlock[]): boolean => {
  if (!Array.isArray(blocks)) {
    return false;
  }

  for (const block of blocks) {
    if (!block.type || block.type !== 'paragraph') {
      return false;
    }

    if (!Array.isArray(block.content)) {
      return false;
    }

    for (const textBlock of block.content) {
      if (textBlock.type !== 'text' || typeof textBlock.text !== 'string') {
        return false;
      }
    }

    if (block.order !== undefined && (typeof block.order !== 'number' || block.order < 0)) {
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

/**
 * Converts HTML string to Tiptap JSON (for backward compatibility)
 */
export const htmlToTiptapJson = (html: string): TiptapJson => {
  // Simple HTML to Tiptap JSON conversion
  const paragraphs = html.split(/<\/?p[^>]*>/).filter(p => p.trim().length > 0);

  const content = paragraphs.map(paragraph => {
    // Extract text and formatting from HTML
    const text = paragraph.replace(/<[^>]*>/g, '');
    const marks: Array<{ type: string; attrs?: Record<string, unknown> }> = [];

    if (paragraph.includes('<strong>') || paragraph.includes('<b>')) {
      marks.push({ type: 'bold' });
    }
    if (paragraph.includes('<em>') || paragraph.includes('<i>')) {
      marks.push({ type: 'italic' });
    }
    if (paragraph.includes('<u>')) {
      marks.push({ type: 'underline' });
    }
    if (paragraph.includes('<s>') || paragraph.includes('<strike>')) {
      marks.push({ type: 'strike' });
    }

    return {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: text.trim(),
          marks: marks.length > 0 ? marks : undefined,
        },
      ],
    };
  });

  return {
    type: 'doc',
    content,
  };
};

/**
 * Converts Tiptap JSON to HTML string (for backward compatibility)
 */
export const tiptapJsonToHtml = (json: TiptapJson): string => {
  if (!json.content || !Array.isArray(json.content)) {
    return '';
  }

  return json.content
    .map(node => {
      if (node.type === 'paragraph' && node.content) {
        let paragraphHtml = '';

        for (const textNode of node.content) {
          if (textNode.type === 'text' && textNode.text) {
            let text = textNode.text;

            if (textNode.marks) {
              for (const mark of textNode.marks) {
                switch (mark.type) {
                  case 'bold':
                    text = `<strong>${text}</strong>`;
                    break;
                  case 'italic':
                    text = `<em>${text}</em>`;
                    break;
                  case 'underline':
                    text = `<u>${text}</u>`;
                    break;
                  case 'strike':
                    text = `<s>${text}</s>`;
                    break;
                }
              }
            }

            paragraphHtml += text;
          }
        }

        return `<p>${paragraphHtml}</p>`;
      }
      return '';
    })
    .join('');
};
