// Content types for different entities
export const CONTENT_TYPES = {
  POEM_CATEGORY: 'POEM_CATEGORY',
  USER_PROFILE: 'USER_PROFILE',
  POEM_TAG: 'POEM_TAG',
} as const;

export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];
