export const POEM_ERRORS = {
  ACCESS_DENIED: 'Access denied. Please log in to continue.',
  AUTHOR_ROLE_REQUIRED: 'Author role is required to create and edit poems.',
  POEM_NOT_FOUND: 'Poem not found.',
  NOT_AUTHORIZED: 'You are not authorized to edit this poem.',
  SLUG_ALREADY_EXISTS: 'A poem with this slug already exists.',
  INVALID_CATEGORY: 'Selected category is invalid.',
  INVALID_TAG: 'One or more tags are invalid.',
  CONTENT_TOO_SHORT: 'Poem content is too short.',
  CONTENT_TOO_LONG: 'Poem content is too long.',
  TOO_MANY_TAGS: 'Too many tags selected.',
  TOO_MANY_IMAGES: 'Too many images in the poem.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
} as const;

export const POEM_SUCCESS = {
  PUBLISHED: 'Poem published successfully!',
  DRAFT_SAVED: 'Draft saved successfully!',
  UPDATED: 'Poem updated successfully!',
  UNPUBLISHED: 'Poem unpublished successfully!',
} as const;

export const POEM_FORM_CONSTANTS = {
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TAGS_COUNT: 10,
  MAX_IMAGES_COUNT: 5,
  MIN_CONTENT_LENGTH: 10,
  MAX_CONTENT_LENGTH: 10000,
  SLUG_PATTERN: /^[a-z0-9-]+$/,
  SUPPORTED_LANGUAGES: ['EN', 'RU', 'UA'] as const,
} as const;

export const POEM_LABELS = {
  TITLE: 'Title',
  TITLE_PLACEHOLDER: 'Enter poem title...',
  SLUG: 'Slug',
  SLUG_PLACEHOLDER: 'poem-title-url',
  DESCRIPTION: 'Description',
  DESCRIPTION_PLACEHOLDER: 'Brief description of your poem...',
  CONTENT: 'Content',
  CONTENT_PLACEHOLDER: 'Write your poem here...',
  CATEGORY: 'Category',
  CATEGORY_PLACEHOLDER: 'Select a category...',
  TAGS: 'Tags',
  TAGS_PLACEHOLDER: 'Add tags...',
  LANGUAGE: 'Language',
  IS_PUBLISHED: 'Publish immediately',
  SAVE_DRAFT: 'Save as draft',
  PUBLISH: 'Publish',
  UPDATE: 'Update',
  CANCEL: 'Cancel',
  SUBMIT: 'Submit',
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  PUBLISHING: 'Publishing...',
} as const;
