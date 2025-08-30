'use client';

import { useCallback } from 'react';
import type { PoemContentBlock, PoemFormData, TiptapJson } from '../../model/types';
import {
  poemContentBlocksToTiptapJson,
  tiptapJsonToPoemContentBlocks,
  htmlToTiptapJson,
} from '../utils/tiptapUtils';

export const useTiptapUtils = () => {
  const getTiptapValue = useCallback((content: PoemContentBlock[] | string): TiptapJson => {
    try {
      if (typeof content === 'string') {
        // Try to parse as JSON first, then as HTML
        try {
          const json = JSON.parse(content) as TiptapJson;
          return json;
        } catch {
          // If not JSON, treat as HTML
          return htmlToTiptapJson(content);
        }
      } else {
        // Convert PoemContentBlock[] to TiptapJson
        return poemContentBlocksToTiptapJson(content);
      }
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
        if (key === 'content' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  }, []);

  const convertTiptapJsonToContentBlocks = useCallback((json: TiptapJson): PoemContentBlock[] => {
    return tiptapJsonToPoemContentBlocks(json);
  }, []);

  return {
    getTiptapValue,
    prepareFormData,
    convertTiptapJsonToContentBlocks,
  };
};
