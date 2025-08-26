# Review Form Structure

## Overview

The Review Form (`src/features/review/ui/ReviewForm.tsx`) allows users with role `AUTHOR` or higher to add reviews with ratings to a poem, adhering to `main_prd.md` (MVP User Stories), `tech_prd.md` (Frontend, Type Safety), `design_prd.md` (UI/UX, Accessibility), and `form_pattern.md` (Form Component Structure).

## Structure

### Form Container
- **Layout**: `flex flex-col gap-4 sm:grid sm:grid-cols-2`
- **Form Component**: Uses `Form` from `shadcn/ui` with `react-hook-form` and `zod` for validation
- **Inputs**: 
  - `Textarea` for review content (`text-lg font-serif`, `bg-background border-input`)
  - `Select` for rating (`bg-background border-input`) with options 1-5
- **Buttons**: Submit (`bg-primary text-primary-foreground`) and Cancel (`bg-muted text-muted-foreground`)
- **Labels and Messages**: From `src/shared/constants/LocaleMessages.ts` (RU for MVP, infrastructure for EN)

### Validation
- **Schema**: `src/features/review/model/schemas.ts`
  ```typescript
  import { z } from 'zod';
  export const reviewFormSchema = z.object({
    content: z.string().min(1).max(1000),
    rating: z.number().min(1).max(5),
  });
  export type ReviewFormData = z.infer<typeof reviewFormSchema>;
  ```
- **Client-side Validation**: Via `zodResolver`
- **Server-side Validation**: In `createReview` Server Action

### Server Action
- **Location**: `src/features/review/server-actions/createReview.ts`
- **Authorization**: Checks role (`AUTHOR+`)
- **Input Sanitization**: Uses `sanitize-html` to prevent XSS
- **Cache Revalidation**: Revalidates `RoutePath.POEMS`

### Accessibility
- **ARIA Attributes**: `aria-label="Review input"`, `aria-describedby="review-error"`
- **Keyboard Navigation**: Tab order, Enter for submission, arrow keys for rating selection
- **Focus Indicator**: 2px purple ring (`ring-2 ring-primary`, `design_prd.md`)

### Adaptivity
- **Mobile**: `flex-col`, reduced padding (`px-4`)
- **Tablet**: `sm:grid sm:grid-cols-2`, standard padding (`sm:px-6`)
- **Desktop**: Wider layout (`lg:px-8`)

## Dependencies

### Core Dependencies
- `react-hook-form@7.61.1` - Form handling
- `zod@4.0.10` - Validation
- `shadcn/ui` - UI components (`Form`, `Textarea`, `Select`, `Button`)
- `sanitize-html` - Input sanitization
- `next-auth@5.0.0-beta` - Role checks

### Styling Dependencies
- `tailwindcss` - Utility classes
- CSS variables from `src/shared/styles/theme.css`

## Security

### Input Sanitization
- **XSS Prevention**: Sanitize input with `sanitize-html` (`tech_prd.md`, Security Metrics)
- **Role-based Access**: Server Action checks role (`AUTHOR+`)
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/shadcnComponents/select';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { reviewFormSchema, type ReviewFormData } from '../model/schemas';
import { createReview } from '../server-actions/createReview';

interface ReviewFormProps {
  poemId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewForm = ({ poemId, onSuccess, onCancel }: ReviewFormProps) => {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { content: '', rating: 1 },
  });

  const onSubmit = async (data: ReviewFormData) => {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('rating', data.rating.toString());
    formData.append('poemId', poemId);

    const result = await createReview(formData);
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
              <FormLabel>Рецензия</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Напишите вашу рецензию..."
                  className="text-lg font-serif bg-background border-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Оценка</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                <FormControl>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Выберите оценку" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 - Плохо</SelectItem>
                  <SelectItem value="2">2 - Неудовлетворительно</SelectItem>
                  <SelectItem value="3">3 - Удовлетворительно</SelectItem>
                  <SelectItem value="4">4 - Хорошо</SelectItem>
                  <SelectItem value="5">5 - Отлично</SelectItem>
                </SelectContent>
              </Select>
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
- **Rating Selection**: Test rating dropdown functionality

### Integration Tests
- **Server Action**: Test review creation workflow
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

## Rating System

### Rating Scale
- **1 Star**: Плохо (Poor)
- **2 Stars**: Неудовлетворительно (Unsatisfactory)
- **3 Stars**: Удовлетворительно (Satisfactory)
- **4 Stars**: Хорошо (Good)
- **5 Stars**: Отлично (Excellent)

### Rating Display
- **Visual Representation**: Star icons or numeric display
- **Accessibility**: ARIA labels for screen readers
- **Responsive Design**: Adapts to different screen sizes

## Integration with Poem Page

### Form Placement
- **Location**: Below poem content, above comments
- **Visibility**: Only for users with `AUTHOR` role or higher
- **Conditional Rendering**: Hidden for poem author

### Data Flow
- **Form Submission**: Creates review via Server Action
- **Cache Update**: Revalidates poem page cache
- **UI Update**: Refreshes review list display

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 2 weeks]
