'use client';

import type { PoemContentRendererProps } from './types';

import { POEM_CONTENT_LABELS } from '../constants/ui';
import { cn } from '../lib/utils';
import { renderContentBlock } from './utils/textFormatting';

/**
 * PoemContentRenderer component for displaying formatted poem content
 *
 * @param props - Component props
 * @param props.content - Array of content blocks to render
 * @param props.className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <PoemContentRenderer
 *   content={poemContentBlocks}
 *   className="prose prose-lg"
 * />
 * ```
 */
export const PoemContentRenderer = ({ content, className }: PoemContentRendererProps) => {
  // UI Constants for poem content rendering
  const UI_CONSTANTS = {
    NO_CONTENT_MESSAGE: POEM_CONTENT_LABELS.NO_CONTENT,
  } as const;

  if (!content || !Array.isArray(content.content) || content.content.length === 0) {
    return (
      <div className={cn('text-center text-muted-foreground py-8', className)}>
        {UI_CONSTANTS.NO_CONTENT_MESSAGE}
      </div>
    );
  }

  return (
    <div className={cn('prose prose-lg max-w-none', className)}>
      {content.content.map((block, index) => (
        <ContentBlock key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
};

/**
 * ContentBlock component for rendering individual content blocks
 */
const ContentBlock = ({
  block,
}: {
  block: {
    type: string;
    content?: {
      type: string;
      text?: string;
      marks?: { type: string; attrs?: Record<string, unknown> }[];
    }[];
    text?: string;
    marks?: { type: string; attrs?: Record<string, unknown> }[];
  };
}) => {
  const renderedContent = renderContentBlock(block);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: renderedContent }}
      className="mb-1 last:mb-0 min-h-[1rem]"
    />
  );
};
