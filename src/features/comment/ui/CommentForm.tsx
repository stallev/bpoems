'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcnComponents/form';
import { Textarea } from '@/shared/ui/shadcnComponents/textarea';
import { UIConstants } from '../constants/ui';
import { CommentFormSchema, type CommentFormData } from '../model/schemas';
import { createComment } from '../server-actions/createComment';

interface CommentFormProps {
  poemId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CommentForm({ poemId, onSuccess, onCancel }: CommentFormProps) {
  const form = useForm<CommentFormData>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      content: '',
      poemId,
    },
  });

  const onSubmit = async (data: CommentFormData) => {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('poemId', data.poemId);

    startTransition(async () => {
      const result = await createComment(formData);
      if (result.success) {
        form.reset();
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel id="content-label">{UIConstants.COMMENT_CONTENT_LABEL}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={UIConstants.COMMENT_CONTENT_PLACEHOLDER}
                  aria-labelledby="content-label"
                  aria-describedby="content-error"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage id="content-error" />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onCancel();
              }}
              disabled={form.formState.isSubmitting}
            >
              {UIConstants.CANCEL_BUTTON}
            </Button>
          )}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? UIConstants.SUBMITTING_BUTTON
              : UIConstants.SUBMIT_BUTTON}
          </Button>
        </div>
      </form>
    </Form>
  );
}
