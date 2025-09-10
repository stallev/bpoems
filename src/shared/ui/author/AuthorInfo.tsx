'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AUTHOR_INFO_LABELS } from '@/shared/constants/ui';
import { cn } from '@/shared/lib/utils';
import type { AuthorInfoProps } from '@/shared/ui/types';

/**
 * AuthorInfo component for displaying author information
 *
 * @param props - Component props
 * @param props.author - Author user object
 * @param props.createdAt - Creation date
 * @param props.className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <AuthorInfo
 *   author={poem.author}
 *   createdAt={poem.createdAt}
 *   className="mb-4"
 * />
 * ```
 */
export const AuthorInfo = ({ author, createdAt, className }: AuthorInfoProps) => {
  // UI Constants for author info
  const UI_CONSTANTS = {
    AUTHOR_BY: AUTHOR_INFO_LABELS.AUTHOR_BY,
    PUBLISHED_ON: AUTHOR_INFO_LABELS.PUBLISHED_ON,
    NO_BIO: AUTHOR_INFO_LABELS.NO_BIO,
  } as const;

  const formatDate = (date: Date) => {
    return format(date, 'dd MMMM yyyy', { locale: ru });
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg border shadow-sm max-w-fit',
        className
      )}
    >
      {/* Author Avatar */}
      {author.image && (
        <img
          src={author.image}
          alt={`${author.name} avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
      )}

      {/* Author Information */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-muted-foreground">{UI_CONSTANTS.AUTHOR_BY}</span>
          <span className="font-semibold text-foreground">{author.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{UI_CONSTANTS.PUBLISHED_ON}</span>
          <time dateTime={createdAt.toISOString()}>{formatDate(createdAt)}</time>
        </div>
      </div>
    </div>
  );
};
