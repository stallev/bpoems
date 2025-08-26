import { ContentApprovalStatus } from '@/shared/constants/ContentStatus';

/**
 * Helper function to check if a status indicates content is published
 */
export const isContentPublished = (status: ContentApprovalStatus): boolean => {
  return status === ContentApprovalStatus.APPROVED;
};

/**
 * Helper function to check if a status requires moderation
 */
export const requiresModeration = (status: ContentApprovalStatus): boolean => {
  return status === ContentApprovalStatus.PENDING || status === ContentApprovalStatus.PENDINGREVIEW;
};

/**
 * Helper function to get the appropriate status for content based on user role
 */
export const getDefaultContentStatusForRole = (userRole: string): ContentApprovalStatus => {
  // Authors, moderators, and admins can publish immediately
  if (['AUTHOR', 'MODERATOR', 'ADMIN'].includes(userRole)) {
    return ContentApprovalStatus.APPROVED;
  }

  // Subscribers and other roles require moderation
  return ContentApprovalStatus.PENDING;
};
