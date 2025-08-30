'use client';

import { useRouter } from 'next/navigation';
import { useState, useActionState, startTransition, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { RichTextEditor } from '@/shared/ui/RichTextEditor';
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
import { POEM_FORM_LABELS } from '../lib/constants';
import { usePoemForm } from '../lib/hooks/usePoemForm';
import { tiptapJsonToPoemContentBlocks } from '../lib/utils/tiptapUtils';
import type { PoemFormProps, PoemFormData, FormState, TiptapJson } from '../model/types';
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
      isEditing && defaultValues?.slug
        ? updatePoem(defaultValues.slug, formData)
        : createPoem(formData),
    { success: false, message: '' }
  );

  const { form, handleSubmit, getTiptapValue } = usePoemForm({
    defaultValues,
    onSuccess,
    onCancel,
  });

  // Handle form submission success
  useEffect(() => {
    if (state.success && state.data) {
      // Show success notification
      toast.success(state.message || 'Стихотворение успешно сохранено');

      if (onSuccess) {
        onSuccess(state.data);
      } else {
        // Default redirect behavior
        router.push(`/poems/${state.data.slug}`);
      }
    } else if (state.message && !state.success) {
      // Show error notification
      toast.error(state.message);
    }
  }, [state.success, state.data, state.message, onSuccess, router]);

  const onSubmit = (data: any) => {
    const formData = handleSubmit(data as PoemFormData);
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleContentChange = (content: TiptapJson) => {
    const contentBlocks = tiptapJsonToPoemContentBlocks(content);
    form.setValue('content', contentBlocks);
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
                <RichTextEditor
                  content={
                    defaultValues?.content ? getTiptapValue(defaultValues.content) : undefined
                  }
                  onChange={handleContentChange}
                  placeholder={POEM_FORM_LABELS.RU.CONTENT_PLACEHOLDER}
                  minHeight="200px"
                  error={!!form.formState.errors.content}
                  className="min-h-[200px]"
                />
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
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {isEditing ? POEM_FORM_LABELS.RU.SUBMIT_UPDATING : POEM_FORM_LABELS.RU.SUBMIT_CREATING}
        </div>
      ) : (
        POEM_FORM_LABELS.RU.SUBMIT
      )}
    </Button>
  );
};
