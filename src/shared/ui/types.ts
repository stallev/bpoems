import type { ShortUserDataFromDB, User } from '@/entities/user/model/types';
import type { RichTextContentType } from '@/shared/model/SimpleTypes';

/**
 * RichTextEditor component props
 */
export interface RichTextEditorProps {
  content?: RichTextContentType | string;
  onChange: (content: RichTextContentType) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  disabled?: boolean;
  error?: boolean;
}

/**
 * AuthorInfo component props
 */
export interface AuthorInfoProps {
  author: ShortUserDataFromDB;
  createdAt: Date;
  className?: string;
}

/**
 * AuthorInfoContainer component props
 */
export interface AuthorInfoContainerProps {
  author: User;
  createdAt: Date;
  className?: string;
  poemSlug?: string;
  poemId?: string;
  isAuthor?: boolean;
  onDelete?: () => void;
}

/**
 * PoemsHeaderButtons component props
 */
export interface PoemsHeaderButtonsProps {
  poemSlug?: string;
  isAuthor?: boolean;
  onDelete?: () => void;
}

/**
 * PostClaimButton component props
 */
export interface PostClaimButtonProps {
  poemId?: string;
  isAuthor?: boolean;
}

/**
 * ClaimReport component props
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ClaimReportProps {
  // No props needed - uses global store
}

/**
 * CommentSection component props
 */
export interface CommentSectionProps {
  poemId: string;
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      image: string | null;
    };
  }>;
  currentUserId?: string;
}

/**
 * ReviewSection component props
 */
export interface ReviewSectionProps {
  poemId: string;
  reviews: Array<{
    id: string;
    title: string;
    content: string;
    rating: number;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  }>;
  currentUserId?: string;
  poemAuthorId: string;
}

/**
 * PoemContentRenderer component props
 */
export interface PoemContentRendererProps {
  content?: RichTextContentType | null;
  className?: string;
}

/**
 * RichTextEditor toolbar option
 */
export interface ToolbarOption {
  icon: React.ReactNode;
  onClick: () => void;
  pressed: boolean;
  title: string;
}

/**
 * Comment form data
 */
export interface CommentFormData {
  content: string;
}

/**
 * Review form data
 */
export interface ReviewFormData {
  title: string;
  content: string;
  rating: number;
}

/**
 * Claim report form data
 */
export interface ClaimReportFormData {
  message: string;
}
