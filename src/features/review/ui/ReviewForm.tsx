'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, startTransition, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcnComponents/select';
import { Textarea } from '@/shared/ui/shadcnComponents/textarea';
import { ReviewFormSchema, ReviewUpdateSchema } from '../model/schemas';
import type { ReviewFormData, ReviewUpdateData } from '../model/schemas';
import { createReview } from '../server-actions/createReview';
import { updateReview } from '../server-actions/updateReview';

interface FormState {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title?: string | null;
    content: string;
    rating: number | null;
    userId: string;
    poemId: string;
    createdAt: Date;
  };
}

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
  const isEditing = Boolean(reviewId);

  const [createState, createAction] = useActionState(
    (prevState: FormState, formData: FormData) => createReview(poemId, formData),
    { success: false, message: '' }
  );

  const [updateState, updateAction] = useActionState(
    (prevState: FormState, formData: FormData) => updateReview(reviewId!, formData),
    { success: false, message: '' }
  );

  const form = useForm<ReviewFormData | ReviewUpdateData>({
    resolver: zodResolver(isEditing ? ReviewUpdateSchema : ReviewFormSchema),
    defaultValues: {
      title: initialData.title,
      content: initialData.content,
      rating: initialData.rating,
    },
  });

  const onSubmit = (data: ReviewFormData | ReviewUpdateData) => {
    const formData = new FormData();
    formData.append('content', data.content.trim());
    formData.append('rating', (data.rating || 5).toString());

    if (data.title) {
      formData.append('title', data.title.trim());
    }

    startTransition(() => {
      if (isEditing) {
        updateAction(formData);
      } else {
        createAction(formData);
      }
    });
  };

  // Handle form submission success
  const currentState = isEditing ? updateState : createState;

  useEffect(() => {
    if (currentState.message) {
      if (currentState.success) {
        toast.success(currentState.message);
        form.reset(); // Сброс формы для чистоты
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(currentState.message);
      }
    }
  }, [currentState, onSuccess, form]);

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
      <div className="flex justify-center sm:justify-end transition-all duration-300 ease-in-out opacity-0 scale-95">
        <Button onClick={onShowForm} variant="outline" className="w-full sm:w-auto">
          {labels.ADD_REVIEW}
        </Button>
      </div>
    );
  }

  return (
    <div className="transition-all duration-300 ease-in-out opacity-100 scale-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Заголовок отзыва (необязательно)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Краткий заголовок отзыва..."
                    className="bg-background border-input text-foreground"
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
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Содержание отзыва</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Напишите ваш отзыв..."
                    className="min-h-[100px] resize-none bg-background border-input text-foreground"
                    aria-label="Содержание отзыва"
                    aria-describedby="content-error"
                    aria-invalid={!!form.formState.errors.content}
                  />
                </FormControl>
                <FormMessage id="content-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Оценка</FormLabel>
                <Select
                  onValueChange={value => field.onChange(Number(value))}
                  defaultValue={(field.value || 5).toString()}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background border-input text-foreground">
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              {labels.CANCEL_REVIEW}
            </Button>
            <SubmitButton isEditing={isEditing} labels={labels} />
          </div>
        </form>
      </Form>
    </div>
  );
}

const SubmitButton = ({
  isEditing,
  labels,
}: {
  isEditing: boolean;
  labels: typeof REVIEW_SECTION_LABELS;
}) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Сохранение...' : isEditing ? labels.EDIT_REVIEW : labels.SUBMIT_REVIEW}
    </Button>
  );
};
