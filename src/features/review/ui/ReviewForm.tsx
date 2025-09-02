'use client';

import { Star } from 'lucide-react';
import { REVIEW_SECTION_LABELS } from '@/shared/constants/ui';
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
import { Textarea } from '@/shared/ui/shadcnComponents/textarea';
import { useReviewForm } from '../lib/hooks/useReviewForm';

interface ReviewFormProps {
  poemId: string;
  reviewId?: string | null;
  initialData?: {
    title: string;
    content: string;
    rating: number;
  };
  isVisible: boolean;
  isAuthenticated: boolean;
  hasUserReview?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  onShowForm: () => void;
  labels?: typeof REVIEW_SECTION_LABELS;
}

export function ReviewForm({
  poemId,
  reviewId,
  initialData = { title: '', content: '', rating: 5 },
  isVisible,
  isAuthenticated,
  hasUserReview = false,
  onSuccess,
  onCancel,
  onShowForm,
  labels = REVIEW_SECTION_LABELS,
}: ReviewFormProps) {
  const {
    data,
    form,
    isSubmitting,
    isEditing,
    handleDataChange,
    handleRatingChange,
    handleSubmit,
    handleCancel,
    canSubmit,
  } = useReviewForm({
    poemId,
    reviewId,
    initialData,
    onSuccess,
    onCancel,
  });

  if (!isAuthenticated) {
    return (
      <div className="text-center text-muted-foreground py-4">
        <p>Войдите, чтобы оставить отзыв</p>
      </div>
    );
  }

  if (!isVisible) {
    // Если у пользователя уже есть отзыв, не показываем кнопку добавления
    if (hasUserReview) {
      return null;
    }

    return (
      <div className="flex justify-center sm:justify-end">
        <Button onClick={onShowForm} variant="outline" className="w-full sm:w-auto">
          {labels.ADD_REVIEW}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  value={data.title}
                  onChange={e => handleDataChange({ ...data, title: e.target.value })}
                  placeholder={labels.REVIEW_TITLE_PLACEHOLDER}
                  aria-label="Заголовок отзыва"
                  aria-describedby="title-error"
                  aria-invalid={!!form.formState.errors.title}
                />
              </FormControl>
              <FormMessage id="title-error" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={() => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                {labels.RATING_LABEL}
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="p-1 hover:scale-110 transition-transform"
                      aria-label={`Оценка ${star} из 5`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= data.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage id="rating-error" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  value={data.content}
                  onChange={e => handleDataChange({ ...data, content: e.target.value })}
                  placeholder={labels.REVIEW_CONTENT_PLACEHOLDER}
                  className="min-h-[100px] resize-none"
                  aria-label="Текст отзыва"
                  aria-describedby="content-error"
                  aria-invalid={!!form.formState.errors.content}
                />
              </FormControl>
              <FormMessage id="content-error" />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isEditing ? labels.EDIT_REVIEW : labels.SUBMIT_REVIEW}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            {labels.CANCEL_REVIEW}
          </Button>
        </div>
      </form>
    </Form>
  );
}
