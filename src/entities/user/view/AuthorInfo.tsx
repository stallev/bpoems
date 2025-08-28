'use client';

import { User } from '@/entities/user/model/types';
import { formatDate } from '@/shared/lib/utils/formatDate';
import { UIConstants } from '../constants/ui';

interface AuthorInfoProps {
  author: User;
  poemCount: number;
}

export function AuthorInfo({ author, poemCount }: AuthorInfoProps) {
  return (
    <section className="bg-muted/50 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
          {author.name?.charAt(0).toUpperCase() ?? 'A'}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">{author.name}</h2>
          {author.bio && (
            <div
              className="text-muted-foreground mb-3 prose prose-sm"
              dangerouslySetInnerHTML={{ __html: author.bio }}
            />
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {UIConstants.POEM_COUNT_LABEL} {poemCount}
            </span>
            <span>{UIConstants.SEPARATOR}</span>
            <span>
              {UIConstants.MEMBER_SINCE_LABEL} {formatDate(author.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
