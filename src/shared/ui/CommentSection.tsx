'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';

import { PostClaimButton } from './PostClaimButton';
import { COMMENT_SECTION_LABELS } from '../constants/ui';

import { Button } from './shadcnComponents/button';
import { Textarea } from './shadcnComponents/textarea';
import type { CommentSectionProps } from './types';

/**
 * CommentSection component for displaying and managing comments
 *
 * @param props - Component props
 * @param props.poemId - ID of the poem
 * @param props.comments - Array of comments
 * @param props.currentUserId - Current user ID
 *
 * @example
 * ```tsx
 * <CommentSection
 *   poemId="poem-123"
 *   comments={comments}
 *   currentUserId="user-456"
 * />
 * ```
 */
export const CommentSection = ({ comments, currentUserId }: CommentSectionProps) => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentText, setCommentText] = useState('');

  // UI Constants for comment section
  const UI_CONSTANTS = {
    NO_COMMENTS_MESSAGE: COMMENT_SECTION_LABELS.NO_COMMENTS_MESSAGE,
    ADD_COMMENT: COMMENT_SECTION_LABELS.ADD_COMMENT,
    COMMENT_PLACEHOLDER: COMMENT_SECTION_LABELS.COMMENT_PLACEHOLDER,
    SUBMIT_COMMENT: COMMENT_SECTION_LABELS.SUBMIT_COMMENT,
    CANCEL_COMMENT: COMMENT_SECTION_LABELS.CANCEL_COMMENT,
  } as const;

  const handleSubmitComment = async () => {
    // TODO: Implement comment submission
    // console.log('Submitting comment:', commentText);
    setCommentText('');
    setIsAddingComment(false);
  };

  const handleCancelComment = () => {
    setCommentText('');
    setIsAddingComment(false);
  };

  return (
    <section className="space-y-4">
      <SectionHeader title="Комментарии" count={comments.length} />

      <CommentsList comments={comments} currentUserId={currentUserId} />

      <CommentForm
        isVisible={isAddingComment}
        commentText={commentText}
        onCommentTextChange={setCommentText}
        onSubmit={handleSubmitComment}
        onCancel={handleCancelComment}
        onShowForm={() => setIsAddingComment(true)}
        isAuthenticated={!!currentUserId}
        labels={UI_CONSTANTS}
      />
    </section>
  );
};

/**
 * Section header component
 */
const SectionHeader = ({ title, count }: { title: string; count: number }) => (
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <span className="text-sm text-muted-foreground">{count} комментариев</span>
  </div>
);

/**
 * Comments list component
 */
const CommentsList = ({
  comments,
  currentUserId,
}: {
  comments: CommentSectionProps['comments'];
  currentUserId?: string;
}) => {
  if (comments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Комментарии отсутствуют</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} currentUserId={currentUserId} />
      ))}
    </div>
  );
};

/**
 * Individual comment item component
 */
const CommentItem = ({
  comment,
  currentUserId,
}: {
  comment: CommentSectionProps['comments'][0];
  currentUserId?: string;
}) => {
  const formatDate = (date: Date) => {
    return format(date, 'dd MMMM yyyy', { locale: ru });
  };

  return (
    <div className="bg-muted/30 rounded-lg p-4 border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-foreground">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
        </div>

        {currentUserId && currentUserId !== comment.author.id && (
          <PostClaimButton poemId={comment.id} isAuthor={false} />
        )}
      </div>
    </div>
  );
};

/**
 * Comment form component
 */
const CommentForm = ({
  isVisible,
  commentText,
  onCommentTextChange,
  onSubmit,
  onCancel,
  onShowForm,
  isAuthenticated,
  labels,
}: {
  isVisible: boolean;
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onShowForm: () => void;
  isAuthenticated: boolean;
  labels: typeof COMMENT_SECTION_LABELS;
}) => {
  if (!isAuthenticated) {
    return (
      <div className="text-center text-muted-foreground py-4">
        <p>Войдите, чтобы оставить комментарий</p>
      </div>
    );
  }

  if (!isVisible) {
    return (
      <Button onClick={onShowForm} variant="outline" className="w-full">
        {labels.ADD_COMMENT}
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={commentText}
        onChange={e => onCommentTextChange(e.target.value)}
        placeholder={labels.COMMENT_PLACEHOLDER}
        className="min-h-[100px] resize-none"
      />
      <div className="flex gap-2">
        <Button onClick={onSubmit} disabled={!commentText.trim()}>
          {labels.SUBMIT_COMMENT}
        </Button>
        <Button onClick={onCancel} variant="outline">
          {labels.CANCEL_COMMENT}
        </Button>
      </div>
    </div>
  );
};
