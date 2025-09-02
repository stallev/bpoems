'use client';

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
import { useCommentForm } from '../lib/hooks/useCommentForm';

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
  const {
    text,
    form,
    isSubmitting,
    isEditing,
    handleTextChange,
    handleSubmit,
    handleCancel,
    canSubmit,
  } = useCommentForm({
    poemId,
    commentId,
    initialContent,
    onSuccess,
    onCancel,
  });

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
      <div className="flex justify-center sm:justify-end">
        <Button onClick={onShowForm} variant="outline" className="w-full sm:w-auto">
          {labels.ADD_COMMENT}
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  value={text}
                  onChange={e => handleTextChange(e.target.value)}
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
          <Button type="button" variant="outline" onClick={handleCancel}>
            {labels.CANCEL_COMMENT}
          </Button>
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isEditing ? labels.EDIT_COMMENT : labels.SUBMIT_COMMENT}
          </Button>
        </div>
      </form>
    </Form>
  );
}
