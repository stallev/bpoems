'use client';

import { useState, useCallback, useRef } from 'react';
import { convertPoemBlocksToQuill, convertQuillToPoemBlocks } from '../utils/poemContentConverter';

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

interface UsePoemContentEditorProps {
  initialContent?: PoemContentBlock[];
  onChange?: (content: any) => void;
}

export const usePoemContentEditor = ({ initialContent, onChange }: UsePoemContentEditorProps) => {
  const [content, setContent] = useState<any>(() => {
    if (initialContent && initialContent.length > 0) {
      return convertPoemBlocksToQuill(initialContent);
    }
    return { ops: [{ insert: '\n' }] };
  });

  const quillRef = useRef<any>(null);

  // Handle content change
  const handleContentChange = useCallback(
    (newContent: any) => {
      setContent(newContent);
      onChange?.(newContent);
    },
    [onChange]
  );

  // Get current content as PoemContentBlock[]
  const getContentBlocks = useCallback((): PoemContentBlock[] => {
    return convertQuillToPoemBlocks(content);
  }, [content]);

  // Set content from PoemContentBlock[]
  const setContentBlocks = useCallback(
    (blocks: PoemContentBlock[]) => {
      const quillContent = convertPoemBlocksToQuill(blocks);
      setContent(quillContent);
      onChange?.(quillContent);
    },
    [onChange]
  );

  // Clear content
  const clearContent = useCallback(() => {
    const emptyContent = { ops: [{ insert: '\n' }] };
    setContent(emptyContent);
    onChange?.(emptyContent);
  }, [onChange]);

  // Insert text at cursor position
  const insertText = useCallback((text: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.insertText(range.index, text);
      }
    }
  }, []);

  // Insert image
  const insertImage = useCallback((imageUrl: string, altText?: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, 'image', {
          src: imageUrl,
          alt: altText || '',
        });
        quill.setSelection(range.index + 1);
      }
    }
  }, []);

  // Insert emoji
  const insertEmoji = useCallback((emoji: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, 'emoji', emoji);
        quill.setSelection(range.index + 1);
      }
    }
  }, []);

  // Get text content only
  const getTextContent = useCallback((): string => {
    if (!content || !content.ops) return '';

    return content.ops
      .filter((op: any) => typeof op.insert === 'string')
      .map((op: any) => op.insert)
      .join('')
      .trim();
  }, [content]);

  // Check if content is empty
  const isEmpty = useCallback((): boolean => {
    const textContent = getTextContent();
    return textContent.length === 0;
  }, [getTextContent]);

  // Get word count
  const getWordCount = useCallback((): number => {
    const textContent = getTextContent();
    if (!textContent) return 0;

    return textContent.split(/\s+/).filter(word => word.length > 0).length;
  }, [getTextContent]);

  // Get character count
  const getCharacterCount = useCallback((): number => {
    return getTextContent().length;
  }, [getTextContent]);

  return {
    content,
    quillRef,
    handleContentChange,
    getContentBlocks,
    setContentBlocks,
    clearContent,
    insertText,
    insertImage,
    insertEmoji,
    getTextContent,
    isEmpty,
    getWordCount,
    getCharacterCount,
  };
};
