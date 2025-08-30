'use client';

import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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
import type { TiptapJson } from '@/features/poem-creation/model/types';
import { cn } from '../lib/utils';
import { Toggle } from './shadcnComponents/toggle';

interface RichTextEditorProps {
  content?: TiptapJson | string;
  onChange: (content: TiptapJson) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  disabled?: boolean;
  error?: boolean;
}

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
  placeholder = 'Начните писать...',
  className,
  minHeight = '200px',
  disabled = false,
  error = false,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-3',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-3',
          },
        },
      }),
      Underline,
    ],
    content: content,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          'min-h-[156px] border rounded-md bg-background py-2 px-3 focus:outline-none',
          'prose prose-sm max-w-none',
          'text-foreground placeholder:text-muted-foreground',
          error && 'border-red-500 focus:ring-red-500',
          !error && 'border-input focus:ring-2 focus:ring-primary focus:ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed'
        ),
        style: `min-height: ${minHeight}`,
        placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON() as TiptapJson;
      onChange(json);
    },
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
      title: 'Заголовок 1',
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive('heading', { level: 2 }),
      title: 'Заголовок 2',
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive('heading', { level: 3 }),
      title: 'Заголовок 3',
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive('bold'),
      title: 'Жирный',
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive('italic'),
      title: 'Курсив',
    },
    {
      icon: <UnderlineIcon className="size-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      pressed: editor.isActive('underline'),
      title: 'Подчеркнутый',
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive('strike'),
      title: 'Зачеркнутый',
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive('bulletList'),
      title: 'Маркированный список',
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive('orderedList'),
      title: 'Нумерованный список',
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
