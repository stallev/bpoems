export type ImageDataType = string;

export type UserName = string | null;

export type TiptapJson = {
  type: string;
  content: Array<{
    type: string;
    content?: Array<{
      type: string;
      text?: string;
      marks?: Array<{
        type: string;
        attrs?: Record<string, unknown>;
      }>;
    }>;
    text?: string;
    marks?: Array<{
      type: string;
      attrs?: Record<string, unknown>;
    }>;
  }>;
};

export type TranslatedItem = {
  id: string;
  type: string;
  values: Record<string, string>;
};

export type RichTextContentType = TiptapJson;
