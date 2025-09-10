import { CommentRenderDataType } from '@/entities/comment/model/types';
import { ReviewRenderDataType } from '@/entities/review/model/types';
import { PoemWithReviewsAndCommentsFromDB, PoemRenderDataType } from '../model/types';

export const getTransformedReviewsData = (
  poem: PoemWithReviewsAndCommentsFromDB
): ReviewRenderDataType[] => {
  return (poem.reviews || []).map(review => ({
    id: !review?.id ? '' : review.id,
    title: !review?.title ? '' : review.title,
    content: !review?.content ? '' : review.content,
    createdAt: !review?.createdAt ? new Date() : review.createdAt,
    updatedAt: !review?.createdAt ? new Date() : review.createdAt, // Using createdAt as fallback
    status: !review?.status ? 'APPROVED' : review.status,
    rating: review.rating || 5, // Default rating
    userId: !review.user.id ? '' : review.user.id,
    poemId: !poem.id ? '' : poem.id,
    user: {
      id: !review.user.id ? '' : review.user.id,
      name: !review.user.name ? '' : review.user.name,
      image: null,
    },
    poem: {
      id: !poem.id ? '' : poem.id,
      title: !poem.title ? '' : poem.title,
      slug: poem.slug,
    },
  }));
};

/**
 * Transform comments data to match CommentWithRelations interface
 */
export const getTransformedCommentsData = (
  poem: PoemWithReviewsAndCommentsFromDB
): CommentRenderDataType[] => {
  return (poem.comments || []).map(comment => ({
    id: !comment?.id ? '' : comment.id,
    content: comment.content,
    createdAt: !comment?.createdAt ? new Date() : new Date(comment.createdAt),
    updatedAt: !comment?.createdAt ? new Date() : new Date(comment.updatedAt), // Using createdAt as fallback
    status: !comment?.status ? 'APPROVED' : comment.status,
    authorId: !comment?.author.id ? '' : comment.author.id,
    poemId: !poem.id ? '' : poem.id,
    isApproved: !comment?.isApproved ? true : comment.isApproved,
    author: {
      id: !comment?.author.id ? '' : comment.author.id,
      name: !comment?.author.name ? '' : comment.author.name,
      image: null,
    },
    poem: {
      id: !poem.id ? '' : poem.id,
      title: !poem.title ? '' : poem.title,
      slug: poem.slug,
    },
  }));
};

export const transformPoemFetchedToRenderData = (
  poem: PoemWithReviewsAndCommentsFromDB
): PoemRenderDataType => {
  return {
    id: poem.id || '',
    slug: poem.slug || '',
    title: poem.title || '',
    content: poem.content || { type: 'doc', content: [] },
    description: poem.description || null,
    authorId: poem.authorId || '',
    status: poem.status || 'APPROVED',
    categoryId: poem.categoryId || '',
    createdAt: poem.createdAt ? new Date(poem.createdAt) : new Date(),
    updatedAt: poem.updatedAt ? new Date(poem.updatedAt) : new Date(),
    publishedAt: poem.publishedAt ? new Date(poem.publishedAt) : new Date(),
    author: poem.author || { id: '', name: null, image: null },
    reviews: getTransformedReviewsData(poem),
    category: poem.category || {
      id: '',
      slug: '',
      isActive: true,
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      translatedItems: [],
    },
    tags: poem.tags || [],
    statistics: poem.statistics || { id: '', poemId: '', views: 0, edits: 0, likes: 0, shares: 0 },
    comments: getTransformedCommentsData(poem),
  };
};
