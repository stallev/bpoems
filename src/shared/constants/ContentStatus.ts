/**
 * Content Approval Status Constants
 *
 * These constants define the possible approval statuses for user-generated content
 * such as poems, comments, and reviews. They correspond to the ContentApprovalStatus
 * enum in the Prisma schema.
 */

export enum ContentApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDINGREVIEW = 'PENDINGREVIEW',
}

/**
 * Content Status Labels for UI display
 */
export const CONTENT_STATUS_LABELS = {
  [ContentApprovalStatus.PENDING]: {
    RU: 'Ожидает модерации',
    EN: 'Pending Review',
    UA: 'Очікує модерації',
  },
  [ContentApprovalStatus.APPROVED]: {
    RU: 'Одобрено',
    EN: 'Approved',
    UA: 'Затверджено',
  },
  [ContentApprovalStatus.REJECTED]: {
    RU: 'Отклонено',
    EN: 'Rejected',
    UA: 'Відхилено',
  },
  [ContentApprovalStatus.PENDINGREVIEW]: {
    RU: 'На рассмотрении',
    EN: 'Under Review',
    UA: 'На розгляді',
  },
} as const;

/**
 * Content Status Colors for UI badges
 */
export const CONTENT_STATUS_COLORS = {
  [ContentApprovalStatus.PENDING]: 'warning',
  [ContentApprovalStatus.APPROVED]: 'success',
  [ContentApprovalStatus.REJECTED]: 'destructive',
  [ContentApprovalStatus.PENDINGREVIEW]: 'secondary',
} as const;
