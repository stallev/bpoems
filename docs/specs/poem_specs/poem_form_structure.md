# Poem Form Component Specification

## Purpose

The `PoemForm` component is designed to provide a comprehensive interface for creating and editing poems on the Christian Poetry Platform. It utilizes `react-quilljs` (version 2.0.5) as a WYSIWYG editor for rich text formatting, supporting the creation of structured poem content with formatting options while maintaining type safety and accessibility standards.

## Form Structure

### Form Fields

1. **`title`** (Required)
   - Type: `string`
   - Validation: Required, 1-255 characters
   - Component: `Input` from `@/shared/ui/shadcnComponents/input`
   - Purpose: Poem title for display and SEO

2. **`categoryId`** (Required)
   - Type: `string`
   - Validation: Required, must correspond to an active category ID
   - Component: `Select` from `@/shared/ui/shadcnComponents/select`
   - Data Source: Active categories via Server Action `getCategories`
   - Display: Russian language names for MVP (planned EN support)

3. **`content`** (Required)
   - Type: `PoemContentBlock[]`
   - Validation: Required, minimum one paragraph with non-empty content
   - Component: `react-quilljs` WYSIWYG editor
   - Storage: JSON field in `Poem.content` (schema.prisma)

## PoemContentBlock Structure

```typescript
interface PoemContentBlock {
  order: number;           // Sequential order for rendering
  textType: 'paragraph';   // Type of content block
  content: string;         // Text content of the paragraph
  formatting: {
    bold: boolean;         // Bold formatting
    italic: boolean;       // Italic formatting
    underline: boolean;    // Underline formatting
  } | null;               // Null if no formatting applied
}
```

## Delta to PoemContentBlock Conversion

### Delta to PoemContentBlock
```typescript
// Example Delta from react-quilljs
const delta = {
  ops: [
    { insert: 'First line of poem\n' },
    { insert: 'Second line', attributes: { bold: true } },
    { insert: '\n' },
    { insert: 'Third line\n' }
  ]
};

// Converted to PoemContentBlock[]
const poemContent: PoemContentBlock[] = [
  {
    order: 0,
    textType: 'paragraph',
    content: 'First line of poem',
    formatting: null
  },
  {
    order: 1,
    textType: 'paragraph',
    content: 'Second line',
    formatting: { bold: true, italic: false, underline: false }
  },
  {
    order: 2,
    textType: 'paragraph',
    content: 'Third line',
    formatting: null
  }
];
```

### PoemContentBlock to Delta
```typescript
// Convert PoemContentBlock[] back to Delta for react-quilljs
const delta = {
  ops: poemContent.map(block => ({
    insert: block.content + '\n',
    attributes: block.formatting || undefined
  }))
};
```

## Validation Rules

### Client-side Validation (Zod)
```typescript
const poemFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Заголовок обязателен')
    .max(255, 'Заголовок не может превышать 255 символов'),
  categoryId: z
    .string()
    .min(1, 'Категория обязательна'),
  content: z
    .array(z.object({
      order: z.number(),
      textType: z.literal('paragraph'),
      content: z.string().min(1, 'Содержимое параграфа не может быть пустым'),
      formatting: z.object({
        bold: z.boolean(),
        italic: z.boolean(),
        underline: z.boolean()
      }).nullable()
    }))
    .min(1, 'Стихотворение должно содержать хотя бы один параграф')
});
```

### Server-side Validation
- Same validation rules as client-side
- Additional XSS protection through content sanitization
- Role-based approval status assignment

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **ARIA Labels**: All form fields have proper `aria-label` attributes
- **Keyboard Navigation**: Full keyboard accessibility with Tab order
- **Focus Indicators**: Purple 2px focus ring as per design specification
- **Screen Reader Support**: Semantic HTML and ARIA attributes
- **Error Announcements**: Screen reader announcements for validation errors

### Form Accessibility Features
```typescript
// Example ARIA implementation
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel id="title-label">Заголовок стихотворения</FormLabel>
      <FormControl>
        <Input
          {...field}
          aria-labelledby="title-label"
          aria-describedby="title-error"
          aria-invalid={!!errors.title}
        />
      </FormControl>
      <FormMessage id="title-error" />
    </FormItem>
  )}
/>
```

## Multilingual Support

### MVP Language Strategy
- **Primary Language**: Russian (RU) for all UI elements
- **Infrastructure**: Prepared for English (EN) support
- **Fallback**: Russian as default fallback

### Language Constants
```typescript
export const POEM_FORM_LABELS = {
  RU: {
    TITLE: 'Заголовок стихотворения',
    CATEGORY: 'Категория',
    CONTENT: 'Содержимое стихотворения',
    SUBMIT: 'Сохранить стихотворение',
    CANCEL: 'Отмена',
    // ... other labels
  },
  EN: {
    TITLE: 'Poem Title',
    CATEGORY: 'Category',
    CONTENT: 'Poem Content',
    SUBMIT: 'Save Poem',
    CANCEL: 'Cancel',
    // ... other labels
  }
} as const;
```

## Dependencies

### Exact Versions (from package.json)
- `react-quilljs`: ^2.0.5
- `next-auth`: 5.0.0-beta.29
- `prisma`: 6.13.0
- `react-hook-form`: 7.62.0
- `zod`: 4.0.15
- `@hookform/resolvers`: 5.2.1

## Implementation Details

### Final Implementation Notes
- **Type Safety**: All components are fully typed with TypeScript
- **Error Handling**: Comprehensive error handling in Server Actions and UI
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes
- **Performance**: Optimized with useTransition and proper cache invalidation
- **Security**: XSS prevention through content sanitization
- **FSD Compliance**: Strict adherence to Feature-Sliced Design architecture

### Resolved Implementation Questions
- **Quill Integration**: Using react-quilljs with proper Delta type handling
- **Form Validation**: Client-side Zod validation with server-side revalidation
- **Role-based Access**: Proper RBAC implementation for different user roles
- **Content Storage**: PoemContentBlock[] structure for rich text formatting
- **Multilingual Support**: Russian language for MVP with EN infrastructure

## FSD Architecture Structure

```
src/features/poem-creation/
├── ui/
│   ├── PoemForm.tsx
│   └── index.ts
├── model/
│   ├── schemas.ts
│   ├── types.ts
│   └── index.ts
├── lib/
│   ├── hooks/
│   │   ├── usePoemForm.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── quillUtils.ts
│   │   └── index.ts
│   ├── constants.ts
│   └── index.ts
├── server-actions/
│   ├── createPoem.ts
│   ├── updatePoem.ts
│   └── index.ts
└── index.ts
```

## Usage Examples

### Create Poem Page
```typescript
// src/app/(noadmin)/profile/add-poem/page.tsx
export default async function AddPoemPage() {
  const categories = await getCategories();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Создать новое стихотворение</h1>
      <PoemForm
        categories={categories}
        onSuccess={(data) => {
          // Redirect to poem page
          redirect(`/poems/${data.slug}`);
        }}
      />
    </div>
  );
}
```

### Edit Poem Page
```typescript
// src/app/(noadmin)/profile/edit-poem/[slug]/page.tsx
export default async function EditPoemPage({ params }: { params: { slug: string } }) {
  const [poem, categories] = await Promise.all([
    poemRepository.getBySlug(params.slug),
    getCategories()
  ]);
  
  if (!poem) {
    notFound();
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Редактировать стихотворение</h1>
      <PoemForm
        defaultValues={{
          title: poem.title,
          categoryId: poem.categoryId,
          content: poem.content as PoemContentBlock[]
        }}
        categories={categories}
        onSuccess={(data) => {
          redirect(`/poems/${data.slug}`);
        }}
      />
    </div>
  );
}
```

## Moderation Integration

### Content Approval Status
- **AUTHOR, MODERATOR, ADMIN**: `Poem.status` set to `APPROVED`
- **SUBSCRIBER**: `Poem.status` set to `PENDING`

### Claim Report Integration
- Server Actions check for existing `ClaimReport` entries
- Content status updated based on claim decisions
- Integration with `ContentApprovalStatus` enum

### Role-based Access Control
```typescript
// Server Action authorization
const session = await auth();
if (!session?.user) {
  throw new Error('Access denied');
}

// Check if user has permission to create/edit poems
if (!['SUBSCRIBER', 'AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
  throw new Error('Insufficient permissions');
}

// Set approval status based on role
const status = ['AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)
  ? 'APPROVED'
  : 'PENDING';
```

## Security Considerations

### XSS Prevention
- Content sanitization before database storage
- HTML encoding for user-generated content
- Validation of allowed HTML tags and attributes

### Input Validation
- Client-side validation with Zod
- Server-side validation with same Zod schemas
- Type safety throughout the application

### CSRF Protection
- Server Actions provide built-in CSRF protection
- No additional CSRF tokens required

## Performance Optimization

### React Quill Optimization
- Lazy loading of Quill editor
- Debounced content updates
- Efficient Delta to PoemContentBlock conversion

### Form Performance
- `useTransition` for smooth form submission
- Optimistic updates where appropriate
- Proper cache invalidation with `revalidatePath`

## Testing Strategy

### Unit Tests
- Validation schema testing
- Quill utility function testing
- Server Action testing

### Integration Tests
- Form submission flow
- Error handling scenarios
- Role-based access control

### E2E Tests
- Complete create/edit workflows
- Accessibility testing
- Cross-browser compatibility

## Future Enhancements

### Planned Features
- Image support in PoemContentBlock (post-MVP)
- Advanced formatting options
- Collaborative editing
- Version history
- Auto-save functionality

### Internationalization
- Full English language support
- Ukrainian language support (Phase 3)
- Dynamic language switching
- Locale-specific formatting

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 2 weeks]
