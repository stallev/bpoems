// Poem content block structure for rich text formatting
export interface PoemContentBlock {
  order: number; // Sequential order for rendering
  textType: 'paragraph'; // Type of content block
  content: string; // Text content of the paragraph
  formatting: {
    bold: boolean; // Bold formatting
    italic: boolean; // Italic formatting
    underline: boolean; // Underline formatting
  } | null; // Null if no formatting applied
}

// Form data structure for poem creation/editing
export interface PoemFormData {
  id?: string; // Poem ID (for editing)
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

// Delta structure from react-quilljs
export interface QuillDelta {
  ops: Array<{
    insert: string;
    attributes?: {
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
    };
  }>;
}

// Type for content block with sanitization
export interface SanitizedContentBlock extends PoemContentBlock {
  content: string; // Sanitized content
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

// Quill utility types
export interface QuillEditorConfig {
  modules: Record<string, unknown>;
  formats: string[];
  placeholder: string;
  theme: string;
}

// Quill instance type
export interface QuillInstance {
  setContents: (delta: QuillDelta) => void;
  getContents: () => QuillDelta;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
}

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
