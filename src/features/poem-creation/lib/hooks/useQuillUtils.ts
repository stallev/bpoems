'use client';

import { useCallback } from 'react';
import type { QuillDelta, PoemContentBlock, PoemFormData } from '../../model/types';

export const useQuillUtils = () => {
  const getQuillValue = useCallback((content: PoemContentBlock[] | string) => {
    try {
      if (typeof content === 'string') {
        const delta = JSON.parse(content) as QuillDelta;
        return delta;
      } else {
        // Convert PoemContentBlock[] to QuillDelta
        const ops = content.map(block => ({
          insert: block.content,
          attributes: block.formatting || {},
        }));
        return { ops };
      }
    } catch {
      // Return empty delta if parsing fails
      return { ops: [] };
    }
  }, []);

  const prepareFormData = useCallback((data: PoemFormData): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'content' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  }, []);

  return {
    getQuillValue,
    prepareFormData,
  };
};
