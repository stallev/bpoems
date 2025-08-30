'use client';

import type { PoemContentBlock } from '@/features/poem-creation/model/types';

interface PoemContentRendererProps {
  content: PoemContentBlock[];
  className?: string;
}

/**
 * Component for rendering poem content with different block types
 */
export const PoemContentRenderer = ({ content, className }: PoemContentRendererProps) => {
  if (!content || content.length === 0) {
    return (
      <div className="text-muted-foreground italic text-center py-8 text-sm sm:text-base">
        Нет содержимого
      </div>
    );
  }
  console.log('content PoemContentRenderer', content);

  return (
    <div
      className={`poem-content space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed ${className || ''}`}
    >
      {content.map((block, index) => (
        <ContentBlock key={index} block={block} />
      ))}
    </div>
  );
};

interface ContentBlockProps {
  block: PoemContentBlock;
}

const ContentBlock = ({ block }: ContentBlockProps) => {
  if (block.type === 'paragraph') {
    return <ParagraphBlock content={block.content} />;
  }

  return null;
};

interface ParagraphBlockProps {
  content: Array<{
    type: 'text';
    text: string;
    marks?: Array<{
      type: 'bold' | 'italic' | 'underline' | 'strike';
      attrs?: Record<string, any>;
    }>;
  }>;
}

const ParagraphBlock = ({ content }: ParagraphBlockProps) => {
  if (!content || content.length === 0) {
    return <div className="h-4" />; // Empty paragraph spacing
  }

  const renderText = (textBlock: ParagraphBlockProps['content'][0]) => {
    let text = textBlock.text;

    if (textBlock.marks) {
      textBlock.marks.forEach(mark => {
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
      });
    }

    return text;
  };

  const combinedText = content.map(renderText).join('');

  return (
    <p
      className="text-foreground leading-relaxed"
      dangerouslySetInnerHTML={{ __html: combinedText }}
    />
  );
};
