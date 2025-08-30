'use client';

import type { User } from '@/entities/user/model/types';
import { AuthorInfo } from './AuthorInfo';
import { PoemsHeaderButtons } from './PoemsHeaderButtons';
import { PostClaimButton } from './PostClaimButton';

interface AuthorInfoContainerProps {
  author: User;
  createdAt: Date;
  className?: string;
  poemSlug?: string;
  poemId?: string;
  isAuthor?: boolean;
  onDelete?: () => void;
}

/**
 * Container component that combines AuthorInfo with action buttons
 * Places AuthorInfo and action buttons side by side
 */
export const AuthorInfoContainer = ({
  author,
  createdAt,
  className,
  poemSlug,
  poemId,
  isAuthor = false,
  onDelete,
}: AuthorInfoContainerProps) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:justify-between sm:items-center  gap-3 sm:gap-4 ${className || ''}`}
    >
      {/* Author Information */}
      <AuthorInfo author={author} createdAt={createdAt} className="flex-1" />

      {/* Action Buttons Container */}
      <div className="flex items-center gap-1 sm:gap-2">
        <PoemsHeaderButtons poemSlug={poemSlug} isAuthor={isAuthor} onDelete={onDelete} />
        <PostClaimButton poemId={poemId} isAuthor={isAuthor} />
      </div>
    </div>
  );
};
