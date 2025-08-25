// Local constants to avoid import issues
const POEM_FORM_CONSTANTS = {
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TAGS_COUNT: 10,
  MAX_IMAGES_COUNT: 5,
  MIN_CONTENT_LENGTH: 10,
  MAX_CONTENT_LENGTH: 10000,
  SLUG_PATTERN: /^[a-z0-9-]+$/,
  SUPPORTED_LANGUAGES: ['EN', 'RU', 'UA'] as const,
};

// Validate slug format and uniqueness
export function validateSlug(slug: string): { isValid: boolean; error?: string } {
  if (!slug) {
    return { isValid: false, error: 'Slug is required' };
  }

  if (!POEM_FORM_CONSTANTS.SLUG_PATTERN.test(slug)) {
    return {
      isValid: false,
      error: 'Slug can only contain lowercase letters, numbers, and hyphens',
    };
  }

  if (slug.length < 3) {
    return { isValid: false, error: 'Slug must be at least 3 characters long' };
  }

  if (slug.length > 50) {
    return { isValid: false, error: 'Slug must be 50 characters or less' };
  }

  return { isValid: true };
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50); // Limit length
}

// Validate content length
export function validateContentLength(content: any): { isValid: boolean; error?: string } {
  if (!content || !content.ops) {
    return { isValid: false, error: 'Content is required' };
  }

  const textContent = content.ops
    .filter((op: any) => typeof op.insert === 'string')
    .map((op: any) => op.insert)
    .join('')
    .trim();

  if (textContent.length < POEM_FORM_CONSTANTS.MIN_CONTENT_LENGTH) {
    return {
      isValid: false,
      error: `Content must be at least ${POEM_FORM_CONSTANTS.MIN_CONTENT_LENGTH} characters long`,
    };
  }

  if (textContent.length > POEM_FORM_CONSTANTS.MAX_CONTENT_LENGTH) {
    return {
      isValid: false,
      error: `Content must be ${POEM_FORM_CONSTANTS.MAX_CONTENT_LENGTH} characters or less`,
    };
  }

  return { isValid: true };
}

// Validate image count
export function validateImageCount(content: any): { isValid: boolean; error?: string } {
  if (!content || !content.ops) {
    return { isValid: true };
  }

  const imageCount = content.ops.filter(
    (op: any) => op.insert && typeof op.insert === 'object' && op.insert.image
  ).length;

  if (imageCount > POEM_FORM_CONSTANTS.MAX_IMAGES_COUNT) {
    return {
      isValid: false,
      error: `Maximum ${POEM_FORM_CONSTANTS.MAX_IMAGES_COUNT} images allowed`,
    };
  }

  return { isValid: true };
}

// Validate tag count
export function validateTagCount(tags: string[]): { isValid: boolean; error?: string } {
  if (!tags || tags.length === 0) {
    return { isValid: true };
  }

  if (tags.length > POEM_FORM_CONSTANTS.MAX_TAGS_COUNT) {
    return {
      isValid: false,
      error: `Maximum ${POEM_FORM_CONSTANTS.MAX_TAGS_COUNT} tags allowed`,
    };
  }

  // Validate individual tags
  for (const tag of tags) {
    if (!tag.trim()) {
      return { isValid: false, error: 'Tags cannot be empty' };
    }

    if (tag.length > 20) {
      return { isValid: false, error: 'Tags must be 20 characters or less' };
    }

    if (!/^[a-zA-Z0-9\s-]+$/.test(tag)) {
      return {
        isValid: false,
        error: 'Tags can only contain letters, numbers, spaces, and hyphens',
      };
    }
  }

  return { isValid: true };
}

// Validate title
export function validateTitle(title: string): { isValid: boolean; error?: string } {
  if (!title || !title.trim()) {
    return { isValid: false, error: 'Title is required' };
  }

  if (title.length > POEM_FORM_CONSTANTS.MAX_TITLE_LENGTH) {
    return {
      isValid: false,
      error: `Title must be ${POEM_FORM_CONSTANTS.MAX_TITLE_LENGTH} characters or less`,
    };
  }

  return { isValid: true };
}

// Validate description
export function validateDescription(description?: string): { isValid: boolean; error?: string } {
  if (!description) {
    return { isValid: true };
  }

  if (description.length > POEM_FORM_CONSTANTS.MAX_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      error: `Description must be ${POEM_FORM_CONSTANTS.MAX_DESCRIPTION_LENGTH} characters or less`,
    };
  }

  return { isValid: true };
}

// Validate language
export function validateLanguage(language: string): { isValid: boolean; error?: string } {
  if (!POEM_FORM_CONSTANTS.SUPPORTED_LANGUAGES.includes(language as any)) {
    return {
      isValid: false,
      error: `Language must be one of: ${POEM_FORM_CONSTANTS.SUPPORTED_LANGUAGES.join(', ')}`,
    };
  }

  return { isValid: true };
}

// Comprehensive form validation
export function validatePoemForm(data: {
  title: string;
  slug: string;
  description?: string;
  content: any;
  tags: string[];
  language: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Validate title
  const titleValidation = validateTitle(data.title);
  if (!titleValidation.isValid) {
    errors.title = titleValidation.error!;
  }

  // Validate slug
  const slugValidation = validateSlug(data.slug);
  if (!slugValidation.isValid) {
    errors.slug = slugValidation.error!;
  }

  // Validate description
  const descriptionValidation = validateDescription(data.description);
  if (!descriptionValidation.isValid) {
    errors.description = descriptionValidation.error!;
  }

  // Validate content
  const contentLengthValidation = validateContentLength(data.content);
  if (!contentLengthValidation.isValid) {
    errors.content = contentLengthValidation.error!;
  }

  const imageCountValidation = validateImageCount(data.content);
  if (!imageCountValidation.isValid) {
    errors.content = imageCountValidation.error!;
  }

  // Validate tags
  const tagValidation = validateTagCount(data.tags);
  if (!tagValidation.isValid) {
    errors.tags = tagValidation.error!;
  }

  // Validate language
  const languageValidation = validateLanguage(data.language);
  if (!languageValidation.isValid) {
    errors.language = languageValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
