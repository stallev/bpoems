'use client';

import { EditorContent, Editor } from '@tiptap/react';
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline as UnderlineIcon,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Toggle } from './shadcnComponents/toggle';
import { RICH_TEXT_EDITOR_LABELS } from '../constants/ui';
import { useRichTextEditor } from './hooks/useRichTextEditor';
import type { RichTextEditorProps } from './types';

/**
 * RichTextEditor component with toolbar for text formatting
 *
 * @param props - Component props
 * @param props.content - Initial content in Tiptap JSON format or string
 * @param props.onChange - Callback function when content changes
 * @param props.placeholder - Placeholder text for empty editor
 * @param props.className - Additional CSS classes
 * @param props.minHeight - Minimum height of the editor
 * @param props.disabled - Whether the editor is disabled
 * @param props.error - Whether to show error styling
 *
 * @example
 * ```tsx
 * <RichTextEditor
 *   content={initialContent}
 *   onChange={(content) => setContent(content)}
 *   placeholder="Начните писать ваше стихотворение..."
 *   minHeight="200px"
 * />
 * ```
 */
export const RichTextEditor = ({
  content,
  onChange,
  placeholder = RICH_TEXT_EDITOR_LABELS.PLACEHOLDER,
  className,
  minHeight = '200px',
  disabled = false,
  error = false,
}: RichTextEditorProps) => {
  const { editor } = useRichTextEditor({
    content,
    onChange,
    placeholder,
    minHeight,
    disabled,
    error,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <MenuBar editor={editor} disabled={disabled} />
      <EditorContent editor={editor} />
    </div>
  );
};

/**
 * MenuBar component with formatting tools
 */
const MenuBar = ({ editor, disabled }: { editor: Editor; disabled: boolean }) => {
  const options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive('heading', { level: 1 }),
      title: RICH_TEXT_EDITOR_LABELS.TOOLBAR.HEADING_1,
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive('heading', { level: 2 }),
      title: RICH_TEXT_EDITOR_LABELS.TOOLBAR.HEADING_2,
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive('heading', { level: 3 }),
      title: RICH_TEXT_EDITOR_LABELS.TOOLBAR.HEADING_3,
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive('bold'),
      title: RICH_TEXT_EDITOR_LABELS.TOOLBAR.BOLD,
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive('italic'),
      title: RICH_TEXT_EDITOR_LABELS.TOOLBAR.ITALIC,
    },
    {
      icon: <UnderlineIcon className="size-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      pressed: editor.isActive('underline'),
      title: RICH_TEXT_EDITOR_LABELS.TOOLBAR.UNDERLINE,
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive('strike'),
      title: RICH_TEXT_EDITOR_LABELS.TOOLBAR.STRIKETHROUGH,
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive('bulletList'),
      title: RICH_TEXT_EDITOR_LABELS.TOOLBAR.BULLET_LIST,
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive('orderedList'),
      title: RICH_TEXT_EDITOR_LABELS.TOOLBAR.ORDERED_LIST,
    },
  ];

  return (
    <div
      className={cn(
        'border rounded-md p-1 bg-background space-x-1 flex flex-wrap gap-1',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      {options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.pressed}
          onPressedChange={option.onClick}
          disabled={disabled}
          title={option.title}
          className="h-8 w-8 p-0"
          variant="outline"
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
};
