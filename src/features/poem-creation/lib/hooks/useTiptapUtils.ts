'use client';

import { useCallback } from 'react';
import type { RichTextContentType } from '@/shared/model/SimpleTypes';
import type { PoemFormData } from '../../model/types';

export const useTiptapUtils = () => {
  const getTiptapValue = useCallback((content: RichTextContentType): RichTextContentType => {
    try {
      return content;
    } catch {
      // Return empty Tiptap JSON if parsing fails
      return {
        type: 'doc',
        content: [],
      };
    }
  }, []);

  const prepareFormData = useCallback((data: PoemFormData): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'content') {
          // content теперь TiptapJson, поэтому просто сериализуем его
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  }, []);

  return {
    getTiptapValue,
    prepareFormData,
  };
};
