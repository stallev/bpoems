# Comment Form Structure

## Overview

The Comment Form (`src/features/comment/ui/CommentForm.tsx`) allows users with role `SUBSCRIBER` or higher to add comments to a poem, adhering to `main_prd.md` (MVP User Stories), `tech_prd.md` (Frontend, Type Safety), `design_prd.md` (UI/UX, Accessibility), and `form_pattern.md` (Form Component Structure).

## Structure

### Form Container
- **Layout**: `flex flex-col gap-4 sm:grid sm:grid-cols-2`
- **Form Component**: Uses `Form` from `shadcn/ui` with `react-hook-form` and `zod` for validation
- **Input**: `Textarea` for comment content (`text-lg font-serif`, `bg-background border-input`)
- **Buttons**: Submit (`bg-primary text-primary-foreground`) and Cancel (`bg-muted text-muted-foreground`)
- **Labels and Messages**: From `src/shared/constants/LocaleMessages.ts` (RU for MVP, infrastructure for EN)

### Validation
- **Schema**: `src/features/comment/model/schemas.ts`
  ```typescript
  import { z } from 'zod';
  export const commentFormSchema = z.object({
    content: z.string().min(1).max(1000),
  });
  export type CommentFormData = z.infer<typeof commentFormSchema>;
  ```
- **Client-side Validation**: Via `zodResolver`
- **Server-side Validation**: In `createComment` Server Action

### Server Action
- **Location**: `src/features/comment/server-actions/createComment.ts`
- **Authorization**: Checks role (`SUBSCRIBER+`)
- **Input Sanitization**: Uses `sanitize-html` to prevent XSS
- **Cache Revalidation**: Revalidates `RoutePath.POEMS`

### Accessibility
- **ARIA Attributes**: `aria-label="Comment input"`, `aria-describedby="comment-error"`
- **Keyboard Navigation**: Tab order, Enter for submission
- **Focus Indicator**: 2px purple ring (`ring-2 ring-primary`, `design_prd.md`)

### Adaptivity
- **Mobile**: `flex-col`, reduced padding (`px-4`)
- **Tablet**: `sm:grid sm:grid-cols-2`, standard padding (`sm:px-6`)
- **Desktop**: Wider layout (`lg:px-8`)

## Dependencies

### Core Dependencies
- `react-hook-form@7.61.1` - Form handling
- `zod@4.0.10` - Validation
- `shadcn/ui` - UI components (`Form`, `Textarea`, `Button`)
- `sanitize-html` - Input sanitization
- `next-auth@5.0.0-beta` - Role checks

### Styling Dependencies
- `tailwindcss` - Utility classes
- CSS variables from `src/shared/styles/theme.css`

## Security

### Input Sanitization
- **XSS Prevention**: Sanitize input with `sanitize-html` (`tech_prd.md`, Security Metrics)
- **Role-based Access**: Server Action checks role (`SUBSCRIBER+`)
- **Validation**: Both client-side and server-side validation

### Data Protection
- **CSRF Protection**: Built-in via Server Actions
- **SQL Injection Prevention**: Use of Prisma ORM
- **Input Validation**: Comprehensive validation using Zod schemas

## Implementation Example

```typescript
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/shadcnComponents/form';
import { Textarea } from '@/shared/ui/shadcnComponents/textarea';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { commentFormSchema, type CommentFormData } from '../model/schemas';
import { createComment } from '../server-actions/createComment';

interface CommentFormProps {
  poemId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CommentForm = ({ poemId, onSuccess, onCancel }: CommentFormProps) => {
  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (data: CommentFormData) => {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('poemId', poemId);

    const result = await createComment(formData);
    if (result.success) {
      form.reset();
      onSuccess?.();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Комментарий</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Напишите ваш комментарий..."
                  className="text-lg font-serif bg-background border-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
          )}
          <Button type="submit" className="bg-primary text-primary-foreground">
            Отправить
          </Button>
        </div>
      </form>
    </Form>
  );
};
```

## Error Handling

### Client-side Errors
- **Validation Errors**: Displayed via `FormMessage` component
- **Network Errors**: Graceful degradation with user feedback
- **Form State**: Loading states and disabled buttons during submission

### Server-side Errors
- **Authorization Errors**: Clear messages for unauthorized access
- **Validation Errors**: Detailed error messages from server validation
- **System Errors**: Generic error messages for system failures

## Testing Considerations

### Unit Tests
- **Form Validation**: Test Zod schema validation
- **Component Rendering**: Test form component rendering
- **User Interactions**: Test form submission and cancellation

### Integration Tests
- **Server Action**: Test comment creation workflow
- **Authorization**: Test role-based access control
- **Error Handling**: Test error scenarios

## Performance Considerations

### Optimization
- **Lazy Loading**: Form components loaded on demand
- **Bundle Splitting**: Efficient code splitting
- **Memoization**: Optimize re-renders with React.memo

### Caching
- **Form State**: Preserve form state during navigation
- **Cache Invalidation**: Proper cache revalidation after submission
- **Optimistic Updates**: Immediate UI feedback for better UX

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 2 weeks]
