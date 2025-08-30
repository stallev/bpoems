import { Underline } from '@tiptap/extension-underline';
import { useEditor, Editor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import type { TiptapJson } from '@/features/poem-creation/model/types';
import type { RichTextEditorProps } from '../types';

/**
 * Custom hook for RichTextEditor logic
 *
 * @param props - RichTextEditor props
 * @returns Editor instance and configuration
 */
export const useRichTextEditor = ({
  content,
  onChange,
  placeholder,
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
        class: `min-h-[156px] border rounded-md bg-background py-2 px-3 focus:outline-none prose prose-sm max-w-none text-foreground placeholder:text-muted-foreground ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-input focus:ring-2 focus:ring-primary focus:ring-offset-2'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        style: `min-height: ${minHeight}`,
        placeholder: placeholder || '',
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON() as TiptapJson;
      onChange(json);
    },
  });

  return { editor };
};

/**
 * Custom hook for RichTextEditor toolbar options
 *
 * @param editor - Tiptap editor instance
 * @param disabled - Whether the editor is disabled
 * @returns Array of toolbar options
 */
export const useToolbarOptions = (editor: Editor | null, disabled: boolean) => {
  if (!editor) return [];

  const options = [
    {
      icon: 'H1',
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive('heading', { level: 1 }),
      title: 'Заголовок 1',
    },
    {
      icon: 'H2',
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive('heading', { level: 2 }),
      title: 'Заголовок 2',
    },
    {
      icon: 'H3',
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive('heading', { level: 3 }),
      title: 'Заголовок 3',
    },
    {
      icon: 'Bold',
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive('bold'),
      title: 'Жирный',
    },
    {
      icon: 'Italic',
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive('italic'),
      title: 'Курсив',
    },
    {
      icon: 'Underline',
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      pressed: editor.isActive('underline'),
      title: 'Подчеркнутый',
    },
    {
      icon: 'Strikethrough',
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive('strike'),
      title: 'Зачеркнутый',
    },
    {
      icon: 'List',
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive('bulletList'),
      title: 'Маркированный список',
    },
    {
      icon: 'ListOrdered',
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive('orderedList'),
      title: 'Нумерованный список',
    },
  ];

  return options.map(option => ({
    ...option,
    disabled,
  }));
};
