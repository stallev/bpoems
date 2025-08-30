'use client';

import { useState } from 'react';
import { formatDate } from '@/shared/lib/utils/formatDate';
import { Avatar, AvatarFallback, AvatarImage } from './shadcnComponents/avatar';
import { Button } from './shadcnComponents/button';
import { Textarea } from './shadcnComponents/textarea';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string | null;
    image?: string;
  };
  createdAt: Date;
}

interface CommentSectionProps {
  poemId: string;
  comments: Comment[];
  className?: string;
}

/**
 * Component for displaying and creating comments
 */
export const CommentSection = ({ poemId, comments }: CommentSectionProps) => {
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');

  console.log('CommentSection comments:', comments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement comment submission
    console.log('Submitting comment:', { poemId, content });
    setShowForm(false);
    setContent('');
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Комментарии</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="outline"
          size="sm"
          className="text-sm"
        >
          {showForm ? 'Отмена' : 'Добавить комментарий'}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-4 sm:p-6 bg-muted/30 rounded-lg border"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Комментарий</label>
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Поделитесь своими мыслями..."
              className="min-h-[100px] text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="text-sm">
              Отправить комментарий
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowForm(false)}
              className="text-sm"
            >
              Отмена
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3 sm:space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 text-sm sm:text-base">
            Пока нет комментариев. Будьте первым!
          </p>
        ) : (
          comments.map(comment => <CommentItem key={comment.id} comment={comment} />)
        )}
      </div>
    </section>
  );
};

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-background rounded-lg p-4 border">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage
            src={comment.author.image || undefined}
            alt={comment.author.name || 'User'}
          />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials(comment.author.name || 'Unknown')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-foreground">{comment.author.name || 'Unknown'}</span>
            <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-foreground leading-relaxed">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};
