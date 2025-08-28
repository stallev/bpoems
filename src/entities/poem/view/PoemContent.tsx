'use client';

import { PoemWithRelations } from '@/entities/poem/model/types';
import { User } from '@/entities/user/model/types';
import { formatDate } from '@/shared/lib/utils/formatDate';
import { UIConstants } from '../constants/ui';

interface PoemContentProps {
  poem: PoemWithRelations;
  author: User;
}

export function PoemContent({ poem, author }: PoemContentProps) {
  return (
    <article className="prose prose-lg max-w-none">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{poem.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>
            {UIConstants.BY_AUTHOR_LABEL} {author.name}
          </span>
          <span>{UIConstants.SEPARATOR}</span>
          <time dateTime={poem.createdAt.toISOString()}>{formatDate(poem.createdAt)}</time>
        </div>
      </header>
      <div className="poem-content" dangerouslySetInnerHTML={{ __html: poem.content || '' }} />
      {poem.tags.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">{UIConstants.TAGS_LABEL}</h3>
          <div className="flex gap-2">
            {poem.tags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
