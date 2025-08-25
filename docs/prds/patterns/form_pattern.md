# Client Form Pattern

## Overview

This pattern describes a standardized approach to creating client forms in React applications that provides the best user experience, follows FSD architecture principles, and adheres to modern development practices.

## Design Principles

### UX/UI Principles
- **Progressive Disclosure**: Complex forms are broken down into logical sections
- **Instant Feedback**: Validation occurs in real-time
- **Accessibility**: Support for keyboard navigation and screen readers
- **Responsiveness**: Forms display correctly on all devices
- **Consistency**: Uniform style and behavior across all forms

### Technical Principles
- **Composition**: Use of base components to create complex forms
- **Reusability**: Common logic is extracted into hooks and utilities
- **Type Safety**: Strict typing of all data and states
- **Validation**: Multi-level validation (client + server)

## Form Component Structure

### Basic Structure
```typescript
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useActionState, startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/shadcnComponents/form';
import { Input } from '@/shared/ui/shadcnComponents/input';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { formSchema, type FormData } from '../model/schemas';
import { submitForm } from '../server-actions';
import { useFormActions } from '../lib/hooks/useFormActions';

interface FormComponentProps {
  defaultValues?: Partial<FormData>;
  onSuccess?: (data: FormData) => void;
  onCancel?: () => void;
}

export const FormComponent = ({ defaultValues, onSuccess, onCancel }: FormComponentProps) => {
  const [state, formAction] = useActionState(
    (prevState: any, formData: FormData) => submitForm(formData),
    { success: false, message: '' }
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { handleSubmit, prepareFormData } = useFormActions();

  const onSubmit = (data: FormData) => {
    const formData = handleSubmit(data);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields */}
        <FormField
          control={form.control}
          name="fieldName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error messages */}
        {state.message && (
          <div className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <SubmitButton />
        </div>
      </form>
    </Form>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  );
};
```

## Validation

### Client-side Validation (Zod)
```typescript
// model/schemas.ts
import { z } from 'zod';

export const formSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain letters and numbers'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type FormData = z.infer<typeof formSchema>;
```

### Server-side Validation
```typescript
// server-actions/submitForm.ts
'use server';

import { revalidatePath } from 'next/cache';
import { formSchema } from '../model/schemas';
import { auth } from '@/shared/api/auth/auth';

export async function submitForm(formData: FormData) {
  try {
    // 1. Authentication
    const session = await auth();
    if (!session?.user) {
      throw new Error('Access denied');
    }

    // 2. Data parsing
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    // 3. Validation
    const validatedData = formSchema.parse(rawData);

    // 4. Business logic
    const result = await processFormData(validatedData);

    // 5. Cache revalidation
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Form submitted successfully',
      data: result,
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: 'An error occurred while submitting the form',
    };
  }
}
```

## Hooks and Utilities

### Form Hook
```typescript
// lib/hooks/useFormActions.ts
import { prepareFormData } from '../utils/formUtils';
import type { FormData } from '../../model/schemas';

export const useFormActions = () => {
  const handleSubmit = (data: FormData): FormData => {
    return prepareFormData(data);
  };

  const resetForm = (form: any) => {
    form.reset();
  };

  return {
    handleSubmit,
    resetForm,
  };
};
```

### Form Utilities
```typescript
// lib/utils/formUtils.ts
export const prepareFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  return formData;
};

export const formatFormError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};
```

## FSD Architecture Compliance

### Folder Structure
```
src/features/feature-name/
├── ui/
│   ├── FormComponent.tsx
│   └── index.ts
├── model/
│   ├── schemas.ts
│   ├── types.ts
│   └── index.ts
├── lib/
│   ├── hooks/
│   │   ├── useFormActions.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── formUtils.ts
│   │   └── index.ts
│   └── index.ts
├── server-actions/
│   ├── submitForm.ts
│   └── index.ts
└── index.ts
```

### Import Principles
- **UI components** import only from `shared/ui`
- **Models** do not import from other layers
- **Hooks** import only utilities and models
- **Server Actions** import only repositories and models

## SOLID Principles Compliance

### Single Responsibility Principle
- Each component has a single responsibility
- Validation logic is separated from UI
- Server Actions contain only business logic

### Open/Closed Principle
- Base components are extended through composition
- Validation schemas are easily extensible
- Hooks are reused without modification

### Dependency Inversion Principle
- Components depend on abstractions (interfaces)
- Server Actions use repositories
- Hooks are injected through props

## PRD Requirements Compliance

### Multilingual Support
```typescript
// constants/formLabels.ts
export const FORM_LABELS = {
  EN: {
    EMAIL: 'Email',
    PASSWORD: 'Password',
    SUBMIT: 'Submit',
  },
  RU: {
    EMAIL: 'Email',
    PASSWORD: 'Пароль',
    SUBMIT: 'Отправить',
  },
  UA: {
    EMAIL: 'Email',
    PASSWORD: 'Пароль',
    SUBMIT: 'Надіслати',
  },
} as const;
```

### Error Handling
- Client-side validation prevents sending incorrect data
- Server-side validation ensures security
- Users receive clear error messages
- Error logging for debugging

### Server Actions
- All forms use Server Actions
- Proper cache revalidation
- Authentication and authorization
- Typed responses

## Best Practices

### Performance
- Use `useTransition` for smooth transitions
- Memoize components with `React.memo`
- Lazy load heavy components

### Security
- Validate on client and server
- Sanitize input data
- CSRF protection through Server Actions

### Accessibility
- Proper ARIA attributes
- Keyboard navigation support
- Semantic markup

### Testing
- Unit tests for validation schemas
- Integration tests for Server Actions
- E2E tests for user scenarios

## Usage Examples

### Simple Form
```typescript
export const SimpleForm = () => {
  return (
    <FormComponent
      defaultValues={{ email: '', password: '' }}
      onSuccess={(data) => console.log('Success:', data)}
    />
  );
};
```

### Advanced Form
```typescript
export const AdvancedForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <Button onClick={() => setIsExpanded(true)}>
        Open Form
      </Button>
    );
  }

  return (
    <div className="bg-muted/30 p-4 rounded-lg border">
      <FormComponent
        defaultValues={{ email: '', password: '' }}
        onSuccess={() => setIsExpanded(false)}
        onCancel={() => setIsExpanded(false)}
      />
    </div>
  );
};
```

## Conclusion

This pattern ensures:
- **Consistency** across all forms in the application
- **Code reuse** and logic sharing
- **Type safety** at all levels
- **Better UX** for users
- **Compliance** with modern development standards
- **Scalability** and maintainability of code
