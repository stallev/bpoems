'use client';

import { PoemsHeaderButtons } from '@/entities/poem/view/PoemsHeaderButtons';
import type { ShortUserDataFromDB } from '@/entities/user/model/types';
import { AuthorInfo } from './AuthorInfo';
import { PostClaimButton } from '../claim/PostClaimButton';
import { useCheckIsAuthor } from '../hooks/useCheckIsAuthor';

interface AuthorInfoContainerProps {
  author: ShortUserDataFromDB;
  createdAt: Date;
  className?: string;
  poemSlug: string;
  poemId: string;
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
}: AuthorInfoContainerProps) => {
  const isAuthor = useCheckIsAuthor(author.id);

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:justify-between sm:items-center  gap-3 sm:gap-4 ${className || ''}`}
    >
      {/* Author Information */}
      <AuthorInfo author={author} createdAt={createdAt} className="flex-1" />

      {/* Action Buttons Container */}
      <div className="flex items-center gap-1 sm:gap-2">
        <PoemsHeaderButtons poemSlug={poemSlug} poemId={poemId} isAuthor={isAuthor} />
        <PostClaimButton poemId={poemId} isAuthor={isAuthor} />
      </div>
    </div>
  );
};
