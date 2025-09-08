// Базовые типы для репозитория
export type Review = {
  id: string;
  title?: string | null;
  content: string;
  rating?: number | null;
  poemId: string;
  userId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ReviewCreateInput = {
  title?: string | null;
  content: string;
  rating?: number | null;
  poemId: string;
  userId: string;
  status?: string;
};

export type ReviewUpdateInput = {
  title?: string | null;
  content?: string;
  rating?: number | null;
  status?: string;
};

export type ReviewOrderByWithRelationInput = {
  [key: string]: 'asc' | 'desc';
};

export type ReviewWhereInput = {
  id?: string;
  poemId?: string;
  userId?: string;
  status?: string;
  [key: string]: string | undefined;
};

export type ReviewWithRelations = Review & {
  poem: {
    id: string;
    title: string;
    slug: string;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export type SimpleReviewCreateInput = {
  title?: string | null;
  content: string;
  rating?: number | null;
  poemId: string;
  userId?: string;
};

export type SimpleReviewUpdateInput = {
  title?: string | null;
  content: string;
  rating?: number | null;
};

// Типы для UI компонентов
export interface ReviewSectionProps {
  poemId: string;
  reviews: Array<{
    id: string;
    title?: string;
    content: string;
    rating: number;
    poemId: string;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  }>;
  currentUserId?: string;
  poemAuthorId?: string;
  hasUserReview?: boolean;
}

export interface ReviewItemProps {
  review: ReviewSectionProps['reviews'][0];
  currentUserId?: string;
  onEditReview: (id: string) => void;
  onDeleteReview: (id: string) => void;
  onEditSuccess?: () => void;
  onEditCancel?: () => void;
  isEditing: boolean;
  editingReviewId: string | null;
  uiConstants: {
    NO_REVIEWS_MESSAGE: string;
    ADD_REVIEW: string;
    REVIEW_TITLE_PLACEHOLDER: string;
    REVIEW_CONTENT_PLACEHOLDER: string;
    RATING_LABEL: string;
    SUBMIT_REVIEW: string;
    CANCEL_REVIEW: string;
    EDIT_REVIEW: string;
  };
}

export interface ReviewsListProps {
  reviews: ReviewSectionProps['reviews'];
  currentUserId?: string;
  onEditReview: (id: string) => void;
  onDeleteReview: (id: string) => void;
  onEditSuccess?: () => void;
  onEditCancel?: () => void;
  isEditing: boolean;
  editingReviewId: string | null;
  uiConstants: ReviewItemProps['uiConstants'];
}
