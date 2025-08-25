'use client';

import { useFormContext } from 'react-hook-form';
import { usePoemContentEditor } from '../lib/hooks/usePoemContentEditor';

// Local constants to avoid import issues
const POEM_LABELS = {
  CONTENT: 'Content',
  CONTENT_PLACEHOLDER: 'Write your poem here...',
};

// Define types locally to avoid import issues
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

interface PoemContentEditorProps {
  initialContent?: PoemContentBlock[];
}

// Note: This is a placeholder for react-quilljs integration
// In a real implementation, you would import and configure react-quilljs
const QuillEditor = ({ value, onChange, placeholder }: any) => {
  return (
    <div className="border rounded-md p-4 min-h-[300px]">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full min-h-[280px] resize-none border-none outline-none"
      />
    </div>
  );
};

export const PoemContentEditor = ({ initialContent }: PoemContentEditorProps) => {
  const { setValue, watch } = useFormContext();
  const content = watch('content');

  const { handleContentChange, getWordCount, getCharacterCount } = usePoemContentEditor({
    initialContent,
    onChange: newContent => {
      setValue('content', newContent);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{POEM_LABELS.CONTENT}</label>
        <div className="text-xs text-muted-foreground">
          {getWordCount()} words • {getCharacterCount()} characters
        </div>
      </div>

      <div className="border rounded-md">
        <QuillEditor
          value={content}
          onChange={handleContentChange}
          placeholder={POEM_LABELS.CONTENT_PLACEHOLDER}
        />
      </div>

      <div className="text-xs text-muted-foreground">
        <p>💡 Tip: Use the toolbar above to format your text, add images, or insert emojis.</p>
      </div>
    </div>
  );
};
