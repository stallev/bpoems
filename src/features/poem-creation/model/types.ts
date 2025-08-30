// Poem content block structure for rich text formatting (Tiptap-compatible)
export interface PoemContentBlock {
  type: 'paragraph'; // Type of content block (always paragraph for now)
  content: Array<{
    type: 'text';
    text: string;
    marks?: Array<{
      type: 'bold' | 'italic' | 'underline' | 'strike';
      attrs?: Record<string, any>;
    }>;
  }>;
  order?: number; // Optional sequential order for backward compatibility
}

// Form data structure for poem creation/editing
export interface PoemFormData {
  id?: string; // Poem ID (for editing)
  slug?: string; // Poem slug (for editing)
  title: string; // Poem title (1-255 characters)
  categoryId: string; // Selected category ID
  content: PoemContentBlock[]; // Array of content blocks
}

// Category data structure for form display
export interface CategoryOption {
  id: string;
  translatedItems: Array<{
    id: string;
    type: string;
    values: any;
  }>;
}

// Props for PoemForm component
export interface PoemFormProps {
  defaultValues?: Partial<PoemFormData>;
  categories: CategoryOption[];
  onSuccess?: (data: { id: string; slug: string }) => void;
  onCancel?: () => void;
}

// Type for content block with sanitization
export interface SanitizedContentBlock extends PoemContentBlock {
  content: Array<{
    type: 'text';
    text: string; // Sanitized text content
    marks?: Array<{
      type: 'bold' | 'italic' | 'underline' | 'strike';
      attrs?: Record<string, any>;
    }>;
  }>;
}

// Type for form state in useActionState
export interface FormState {
  success: boolean;
  message: string;
  data?: { id: string; slug: string };
}

// Type for translation values
export interface TranslationValues {
  EN: string;
  RU: string;
  UA: string;
}

// Type for category translations in repository
export interface CategoryTranslationData {
  EN: string;
  RU: string;
  UA: string;
}

// Hook parameter types
export interface UsePoemFormParams {
  defaultValues?: Partial<PoemFormData>;
  onSuccess?: (data: { id: string; slug: string }) => void;
  onCancel?: () => void;
}

// Tiptap utility types
export interface TiptapEditorConfig {
  extensions: any[];
  content: any;
  placeholder: string;
  onUpdate: (params: { editor: any }) => void;
}

// Tiptap instance type
export interface TiptapInstance {
  getJSON: () => any;
  setContent: (content: any) => void;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
}

// Tiptap JSON structure
export interface TiptapJson {
  type: string;
  content: Array<{
    type: string;
    content?: Array<{
      type: string;
      text?: string;
      marks?: Array<{
        type: string;
        attrs?: Record<string, any>;
      }>;
    }>;
    text?: string;
    marks?: Array<{
      type: string;
      attrs?: Record<string, any>;
    }>;
  }>;
}

// Union type for Tiptap content - can be either TiptapJson object or PoemContentBlock array
export type TiptapContent = TiptapJson | PoemContentBlock[];

// Form submission state types
export interface FormSubmissionState {
  success: boolean;
  message: string;
  data?: { id: string; slug: string };
}

// Server Action result types
export interface CreatePoemResult {
  success: boolean;
  message: string;
  data?: { id: string; slug: string };
}

export interface UpdatePoemResult {
  success: boolean;
  message: string;
  data?: { id: string; slug: string };
}

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Content sanitization types
export interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  stripEmptyTags?: boolean;
}
