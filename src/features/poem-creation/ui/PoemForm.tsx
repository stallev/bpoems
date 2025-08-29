'use client';

import { useRouter } from 'next/navigation';
import type { Delta } from 'quill';
import { useState, useActionState, startTransition, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcnComponents/form';
import { Input } from '@/shared/ui/shadcnComponents/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcnComponents/select';
import { POEM_FORM_LABELS, QUILL_MODULES, QUILL_FORMATS } from '../lib/constants';
import { usePoemForm } from '../lib/hooks/usePoemForm';
import { deltaToPoemContentBlocks } from '../lib/utils/quillUtils';
import type { PoemFormProps, PoemFormData, QuillDelta, FormState } from '../model/types';
import { createPoem, updatePoem } from '../server-actions';

/**
 * PoemForm component for creating and editing poems
 *
 * @param props - Component props
 * @param props.defaultValues - Initial form values for editing
 * @param props.categories - Available categories for selection
 * @param props.onSuccess - Callback function on successful submission
 * @param props.onCancel - Callback function on form cancellation
 *
 * @example
 * ```tsx
 * <PoemForm
 *   categories={categories}
 *   onSuccess={(data) => router.push(`/poems/${data.slug}`)}
 * />
 * ```
 */
export const PoemForm = ({ defaultValues, categories, onSuccess, onCancel }: PoemFormProps) => {
  const [isEditing] = useState(!!defaultValues?.title);
  const router = useRouter();
  const [state, formAction] = useActionState(
    (prevState: FormState, formData: FormData) =>
      isEditing && defaultValues?.id
        ? updatePoem(defaultValues.id, formData)
        : createPoem(formData),
    { success: false, message: '' }
  );

  const { form, handleSubmit, getQuillValue } = usePoemForm({
    defaultValues,
    onSuccess,
    onCancel,
  });

  // Initialize Quill editor
  const { quill, quillRef } = useQuill({
    modules: QUILL_MODULES,
    formats: QUILL_FORMATS as unknown as string[],
    placeholder: POEM_FORM_LABELS.RU.CONTENT_PLACEHOLDER,
    theme: 'snow',
  });

  // Set initial Quill content
  useEffect(() => {
    if (quill && defaultValues?.content) {
      const delta = getQuillValue(defaultValues.content);
      quill.setContents(delta as Delta);
    }
  }, [quill, defaultValues?.content, getQuillValue]);

  // Handle Quill content changes
  useEffect(() => {
    if (quill) {
      const handleChange = () => {
        const delta = quill.getContents();
        const contentBlocks = deltaToPoemContentBlocks(delta as QuillDelta);
        form.setValue('content', contentBlocks);
      };

      quill.on('text-change', handleChange);
      return () => {
        quill.off('text-change', handleChange);
      };
    }
  }, [quill, form]);

  // Handle form submission success
  useEffect(() => {
    if (state.success && state.data) {
      if (onSuccess) {
        onSuccess(state.data);
      } else {
        // Default redirect behavior
        router.push(`/poems/${state.data.slug}`);
      }
    }
  }, [state.success, state.data, onSuccess, router]);

  const onSubmit = (data: PoemFormData) => {
    const formData = handleSubmit(data);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel id="title-label">{POEM_FORM_LABELS.RU.TITLE}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={POEM_FORM_LABELS.RU.TITLE_PLACEHOLDER}
                  aria-labelledby="title-label"
                  aria-describedby="title-error"
                  aria-invalid={!!form.formState.errors.title}
                  className={`bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 ${
                    form.formState.errors.title ? 'border-red-500' : ''
                  }`}
                />
              </FormControl>
              <FormMessage style={{ color: '#dc2626' }} className="text-red-700" id="title-error" />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="cursor-pointer">
              <FormLabel id="category-label">{POEM_FORM_LABELS.RU.CATEGORY}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    aria-labelledby="category-label"
                    aria-describedby="category-error"
                    aria-invalid={!!form.formState.errors.categoryId}
                    className={`bg-background border-input text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 ${
                      form.formState.errors.categoryId ? 'border-red-500' : ''
                    }`}
                  >
                    <SelectValue placeholder={POEM_FORM_LABELS.RU.CATEGORY_PLACEHOLDER} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background border-input">
                  {categories.map(category => {
                    const translatedItem = category.translatedItems?.find(
                      item => item.type === 'POEM_CATEGORY'
                    );
                    const categoryName = translatedItem?.values?.RU || category.id;
                    return (
                      <SelectItem key={category.id} value={category.id}>
                        {categoryName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage
                style={{ color: '#dc2626' }}
                className="text-red-700"
                id="category-error"
              />
            </FormItem>
          )}
        />

        {/* Content Field */}
        <FormField
          control={form.control}
          name="content"
          render={() => (
            <FormItem>
              <FormLabel id="content-label">{POEM_FORM_LABELS.RU.CONTENT}</FormLabel>
              <FormControl>
                <div
                  className={`min-h-[200px] border border-input rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 bg-background transition-all duration-200 ${
                    form.formState.errors.content ? 'border-red-500' : ''
                  }`}
                  aria-labelledby="content-label"
                  aria-describedby="content-error"
                  aria-invalid={!!form.formState.errors.content}
                >
                  <div
                    ref={quillRef}
                    className="ql-editor ql-blank h-full overflow-y-auto rounded-md text-xl"
                    style={{
                      maxHeight: 'calc(100% - 40px)',
                      borderColor: 'transparent',
                      fontSize: '1.2rem',
                      lineHeight: '1.5',
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage
                className="text-red-700"
                id="content-error"
                style={{ color: '#dc2626' }}
              />
            </FormItem>
          )}
        />

        {/* Error/Success Messages */}
        {state.message && (
          <div
            className={`text-sm p-3 rounded-md border ${
              state.success
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
            role="alert"
            aria-live="polite"
          >
            {state.message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="bg-background border-input text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              {POEM_FORM_LABELS.RU.CANCEL}
            </Button>
          )}
          <SubmitButton isEditing={isEditing} />
        </div>
      </form>
    </Form>
  );
};

/**
 * Submit button component with loading state
 *
 * @param props - Component props
 * @param props.isEditing - Whether the form is in editing mode
 */
const SubmitButton = ({ isEditing }: { isEditing: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending
        ? isEditing
          ? POEM_FORM_LABELS.RU.SUBMIT_UPDATING
          : POEM_FORM_LABELS.RU.SUBMIT_CREATING
        : POEM_FORM_LABELS.RU.SUBMIT}
    </Button>
  );
};
