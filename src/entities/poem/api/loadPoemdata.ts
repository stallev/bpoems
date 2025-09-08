import { notFound } from 'next/navigation';

import { commentRepository } from '@/entities/comment';
import { poemRepository } from '@/entities/poem';
import { reviewRepository } from '@/entities/review';
import { userRepository } from '@/entities/user';
import { auth } from '@/shared/api/auth/auth';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';

async function loadPoemData(slug: string) {
  const [session, poem] = await Promise.all([
    auth(),
    poemRepository.getPoemBySlugWithReviewsAndComments(slug),
  ]);

  if (!poem) {
    notFound();
  }

  const [author, reviews, comments] = await Promise.all([
    userRepository.findWithPoems(poem.authorId),
    reviewRepository.findByPoemId(poem.id, { take: 10 }),
    commentRepository.findByPoemId(poem.id, { take: 20 }),
  ]);

  if (!author) {
    throw new Error(ErrorMessages.AUTHOR_NOT_FOUND);
  }

  return {
    session,
    poem,
    author,
    reviews,
    comments,
  };
}

export { loadPoemData };
