# Poem Form Structure Specification

## Overview

This document outlines the detailed structure for the poem creation and editing form, following the established patterns and requirements from the project's technical specifications.

## Form Architecture

### FSD Structure
```
src/features/poem-management/
├── ui/
│   ├── PoemForm/
│   │   ├── ui/
│   │   │   ├── PoemForm.tsx
│   │   │   ├── PoemContentEditor.tsx
│   │   │   ├── PoemMetadataFields.tsx
│   │   │   └── index.ts
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   ├── schemas.ts
│   │   │   ├── constants.ts
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   ├── hooks/
│   │   │   │   ├── usePoemForm.ts
│   │   │   │   ├── usePoemContentEditor.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── poemContentConverter.ts
│   │   │   │   ├── poemValidation.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts
├── server-actions/
│   ├── createPoem.ts
│   ├── updatePoem.ts
│   └── index.ts
└── index.ts
```

## Data Models

### PoemContentBlock Interface
```typescript
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
  customStyles?: Record<string, string>;
}
```

### Poem Form Data Interface
```typescript
interface PoemFormData {
  title: string;
  slug: string;
  description?: string;
  content: PoemContentBlock[];
  categoryId?: string;
  tags: string[];
  isPublished: boolean;
  language: 'EN' | 'RU' | 'UA';
}
```

### Poem Form Props Interface
```typescript
interface PoemFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<PoemFormData>;
  onSubmit: (data: PoemFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}
```

## Form Components Structure

### 1. PoemForm (Main Component)
- **Purpose**: Main form container that orchestrates all sub-components
- **Features**:
  - Form validation using Zod schema
  - Error handling and display
  - Loading states
  - Submit/cancel actions
  - Responsive layout

### 2. PoemMetadataFields
- **Purpose**: Handles basic poem metadata (title, slug, description, category, tags)
- **Features**:
  - Title input with auto-slug generation
  - Manual slug editing capability
  - Description textarea
  - Category selection dropdown
  - Tags input with autocomplete
  - Language selection

### 3. PoemContentEditor
- **Purpose**: Rich text editor for poem content using react-quilljs
- **Features**:
  - React Quill integration
  - Content conversion between Quill format and PoemContentBlock[]
  - Real-time preview
  - Image upload handling
  - Emoji picker integration
  - Formatting toolbar customization

## Content Conversion Logic

### Quill to PoemContentBlock Conversion
```typescript
function convertQuillToPoemBlocks(quillContent: any): PoemContentBlock[] {
  // Parse Quill delta format
  // Convert each operation to PoemContentBlock
  // Handle different content types (text, image, formatting)
  // Preserve order and styling information
}
```

### PoemContentBlock to Quill Conversion
```typescript
function convertPoemBlocksToQuill(blocks: PoemContentBlock[]): any {
  // Convert PoemContentBlock[] back to Quill delta format
  // Reconstruct formatting and styling
  // Handle images and emojis
  // Maintain content structure
}
```

## Validation Schema

### Zod Schema for Poem Form
```typescript
const poemFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  description: z.string().max(500, 'Description too long').optional(),
  content: z.array(poemContentBlockSchema).min(1, 'Content is required'),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).max(10, 'Too many tags'),
  isPublished: z.boolean(),
  language: z.enum(['EN', 'RU', 'UA']),
});
```

## Server Actions

### createPoem Server Action
- **Location**: `src/features/poem-management/server-actions/createPoem.ts`
- **Features**:
  - Authentication and authorization checks
  - Input validation
  - Content processing and storage
  - Database transaction handling
  - Error handling and logging
  - Cache invalidation

### updatePoem Server Action
- **Location**: `src/features/poem-management/server-actions/updatePoem.ts`
- **Features**:
  - Authentication and authorization checks
  - Ownership verification
  - Input validation
  - Content processing and storage
  - Database transaction handling
  - Error handling and logging
  - Cache invalidation

## Custom Hooks

### usePoemForm Hook
- **Purpose**: Manages form state and validation
- **Features**:
  - React Hook Form integration
  - Zod validation
  - Error state management
  - Loading state management
  - Form submission handling

### usePoemContentEditor Hook
- **Purpose**: Manages rich text editor state and content conversion
- **Features**:
  - React Quill integration
  - Content conversion utilities
  - Editor configuration
  - Image upload handling
  - Emoji picker integration

## Utility Functions

### poemContentConverter
- **Purpose**: Handles conversion between different content formats
- **Functions**:
  - `convertQuillToPoemBlocks()`
  - `convertPoemBlocksToQuill()`
  - `validatePoemContent()`
  - `sanitizePoemContent()`

### poemValidation
- **Purpose**: Additional validation logic beyond Zod schema
- **Functions**:
  - `validateSlug()`
  - `validateContentLength()`
  - `validateImageCount()`
  - `validateTagCount()`

## Constants and Configuration

### Form Constants
```typescript
export const POEM_FORM_CONSTANTS = {
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TAGS_COUNT: 10,
  MAX_IMAGES_COUNT: 5,
  MIN_CONTENT_LENGTH: 10,
  SLUG_PATTERN: /^[a-z0-9-]+$/,
  SUPPORTED_LANGUAGES: ['EN', 'RU', 'UA'] as const,
};
```

### Editor Configuration
```typescript
export const QUILL_EDITOR_CONFIG = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'emoji'],
    ],
    emoji: {
      showTooltip: true,
    },
    imageUploader: {
      upload: (file: File) => Promise<string>,
    },
  },
  placeholder: 'Write your poem here...',
  theme: 'snow',
};
```

## Error Handling

### Form Error Types
```typescript
interface PoemFormErrors {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  categoryId?: string;
  tags?: string;
  general?: string;
}
```

### Error Display Strategy
- Field-level error messages
- Form-level error summary
- Toast notifications for success/error states
- Loading indicators during submission

## Accessibility Features

### ARIA Attributes
- Proper form labels and descriptions
- Error message associations
- Loading state announcements
- Keyboard navigation support

### Screen Reader Support
- Semantic HTML structure
- Descriptive error messages
- Content change announcements
- Form state announcements

## Responsive Design

### Mobile-First Approach
- Touch-friendly form controls
- Optimized editor toolbar for mobile
- Collapsible sections for better UX
- Swipe gestures for navigation

### Desktop Enhancements
- Full editor toolbar
- Side-by-side preview mode
- Keyboard shortcuts
- Advanced formatting options

## Performance Considerations

### Optimization Strategies
- Lazy loading of editor components
- Debounced validation
- Memoized content conversion
- Efficient re-rendering with React.memo
- Image optimization and compression

### Caching Strategy
- Form state persistence
- Draft auto-save functionality
- Content preview caching
- Validation result caching

## Security Measures

### Input Sanitization
- HTML content sanitization
- XSS prevention
- Content length limits
- File upload restrictions

### Authorization Checks
- User authentication verification
- Poem ownership validation
- Role-based access control
- Content moderation integration

## Testing Strategy

### Unit Tests
- Form validation logic
- Content conversion utilities
- Custom hooks behavior
- Error handling scenarios

### Integration Tests
- Form submission flow
- Server action integration
- Database operations
- Error recovery scenarios

### E2E Tests
- Complete form workflow
- Content editing experience
- Error handling flows
- Responsive behavior

## Internationalization

### Multi-language Support
- Form labels and messages
- Error messages
- Placeholder text
- Tooltip content

### RTL Language Support
- Text direction handling
- Layout adjustments
- Editor configuration
- Content alignment

## Future Enhancements

### Planned Features
- Collaborative editing
- Version history
- Advanced formatting options
- AI-powered content suggestions
- Social sharing integration
- Analytics integration

### Scalability Considerations
- Modular component architecture
- Plugin system for extensions
- Performance monitoring
- User feedback integration
