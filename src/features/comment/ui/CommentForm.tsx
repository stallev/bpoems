'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useActionState, startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { COMMENT_SECTION_LABELS } from '@/shared/constants/ui';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/shadcnComponents/form';
import { Textarea } from '@/shared/ui/shadcnComponents/textarea';
import { CommentFormSchema, CommentUpdateSchema } from '../model/schemas';
import type { CommentFormData, CommentUpdateData } from '../model/schemas';
import { createComment } from '../server-actions/createComment';
import { updateComment } from '../server-actions/updateComment';

interface FormState {
  success: boolean;
  message: string;
  data?: {
    id: string;
    content: string;
    authorId: string;
    poemId: string;
    createdAt: Date;
  };
}

interface CommentFormProps {
  poemId: string;
  commentId?: string | null;
  initialContent?: string;
  isVisible: boolean;
  isAuthenticated: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  onShowForm: () => void;
  labels?: typeof COMMENT_SECTION_LABELS;
}

export function CommentForm({
  poemId,
  commentId,
  initialContent = '',
  isVisible,
  isAuthenticated,
  onSuccess,
  onCancel,
  onShowForm,
  labels = COMMENT_SECTION_LABELS,
}: CommentFormProps) {
  const isEditing = Boolean(commentId);

  const [createState, createAction] = useActionState(
    (prevState: FormState, formData: FormData) => createComment(poemId, formData),
    { success: false, message: '' }
  );

  const [updateState, updateAction] = useActionState(
    (prevState: FormState, formData: FormData) => updateComment(commentId!, formData),
    { success: false, message: '' }
  );

  const form = useForm<CommentFormData | CommentUpdateData>({
    resolver: zodResolver(isEditing ? CommentUpdateSchema : CommentFormSchema),
    defaultValues: {
      content: initialContent,
    },
  });

  const onSubmit = (data: CommentFormData | CommentUpdateData) => {
    const formData = new FormData();
    formData.append('content', data.content.trim());

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

  // Show toast notifications and handle success only once
  React.useEffect(() => {
    if (currentState.message) {
      if (currentState.success) {
        toast.success(currentState.message);
        // Вызываем onSuccess только один раз
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(currentState.message);
      }
    }
  }, [currentState.message, currentState.success, onSuccess]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground mb-3">Войдите, чтобы оставить комментарий</p>
        <Button onClick={onShowForm} variant="outline">
          {labels.ADD_COMMENT}
        </Button>
      </div>
    );
  }

  if (!isVisible) {
    return (
      <div className="flex justify-center sm:justify-end transition-all duration-300 ease-in-out opacity-0 scale-95">
        <Button onClick={onShowForm} variant="outline" className="w-full sm:w-auto">
          {labels.ADD_COMMENT}
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
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={labels.COMMENT_PLACEHOLDER}
                    className="min-h-[100px] resize-none"
                    aria-label="Текст комментария"
                    aria-describedby="comment-error"
                    aria-invalid={!!form.formState.errors.content}
                  />
                </FormControl>
                <FormMessage id="comment-error" />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              {labels.CANCEL_COMMENT}
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
  labels: typeof COMMENT_SECTION_LABELS;
}) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Сохранение...' : isEditing ? labels.EDIT_COMMENT : labels.SUBMIT_COMMENT}
    </Button>
  );
};
