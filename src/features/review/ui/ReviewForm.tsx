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
import { ReviewFormSchema, type ReviewFormData } from '../model/schemas';
import { createReview } from '../server-actions/createReview';

interface ReviewFormProps {
  poemId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ poemId, onSuccess, onCancel }: ReviewFormProps) {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      content: '',
      rating: 0,
      poemId,
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('rating', data.rating.toString());
    formData.append('poemId', data.poemId);

    startTransition(async () => {
      const result = await createReview(formData);
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
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel id="rating-label">{UIConstants.RATING_LABEL}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(value => (
                    <Button
                      key={value}
                      type="button"
                      variant={field.value >= value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => field.onChange(value)}
                      className="w-10 h-10"
                      aria-label={`${value} ${UIConstants.RATING_STARS_LABEL}`}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel id="content-label">{UIConstants.REVIEW_CONTENT_LABEL}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={UIConstants.REVIEW_CONTENT_PLACEHOLDER}
                  aria-labelledby="content-label"
                  aria-describedby="content-error"
                  className="min-h-[150px]"
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
