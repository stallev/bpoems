/**
 * Utility functions for text formatting in PoemContentRenderer
 */

/**
 * Applies text marks (bold, italic, underline, strike) to text content
 *
 * @param text - Text content to format
 * @param marks - Array of mark objects with type and attributes
 * @returns Formatted text with appropriate HTML tags
 */
export const applyTextMarks = (
  text: string,
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>
): string => {
  if (!marks || marks.length === 0) {
    return text;
  }

  let formattedText = text;

  // Apply marks in order (inner to outer)
  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        formattedText = `<strong>${formattedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${formattedText}</em>`;
        break;
      case 'underline':
        formattedText = `<u>${formattedText}</u>`;
        break;
      case 'strike':
        formattedText = `<s>${formattedText}</s>`;
        break;
    }
  }

  return formattedText;
};

/**
 * Renders a content block based on its type
 *
 * @param block - Content block to render
 * @returns Rendered HTML string
 */
export const renderContentBlock = (block: {
  type: string;
  content?: Array<{
    type: string;
    text?: string;
    marks?: Array<{
      type: string;
      attrs?: Record<string, unknown>;
    }>;
  }>;
  order?: number;
}): string => {
  switch (block.type) {
    case 'paragraph':
      return renderParagraphBlock(block);
    case 'heading':
      return renderHeadingBlock(block);
    default:
      return renderParagraphBlock(block); // Default to paragraph
  }
};

/**
 * Renders a paragraph block
 *
 * @param block - Paragraph block to render
 * @returns Rendered HTML string
 */
const renderParagraphBlock = (block: {
  content?: Array<{
    type: string;
    text?: string;
    marks?: Array<{
      type: string;
      attrs?: Record<string, unknown>;
    }>;
  }>;
}): string => {
  const content = (block.content ?? [])
    .map(textBlock => {
      if (textBlock.type === 'text') {
        return applyTextMarks(textBlock.text || '', textBlock.marks);
      }
      return textBlock.text || '';
    })
    .join('');

  return `<p>${content}</p>`;
};

/**
 * Renders a heading block
 *
 * @param block - Heading block to render
 * @returns Rendered HTML string
 */
const renderHeadingBlock = (block: {
  content?: Array<{
    type: string;
    text?: string;
    marks?: Array<{
      type: string;
      attrs?: Record<string, unknown>;
    }>;
  }>;
}): string => {
  const content = (block.content ?? [])
    .map(textBlock => {
      if (textBlock.type === 'text') {
        return applyTextMarks(textBlock.text || '', textBlock.marks);
      }
      return textBlock.text || '';
    })
    .join('');

  return `<h2>${content}</h2>`;
};
