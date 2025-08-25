'use client';

import { useRouter } from 'next/navigation';
import { useActionState, startTransition } from 'react';
import { updatePoem } from '@/features/poem-management/server-actions/updatePoem';
import { PoemForm } from './PoemForm';

// Define types locally
interface PoemFormData {
  title: string;
  slug: string;
  description?: string;
  content: any;
  categoryId?: string;
  tags: string[];
  isPublished: boolean;
  language: 'EN' | 'RU' | 'UA';
}

interface EditPoemFormProps {
  poem: any; // Type from poemRepository.findBySlug
}

export const EditPoemForm = ({ poem }: EditPoemFormProps) => {
  const router = useRouter();
  const [state, formAction] = useActionState(
    (prevState: any, formData: FormData) => updatePoem(poem.id, formData),
    { success: false, message: '' }
  );

  // Prepare initial data for the form
  const initialData: Partial<PoemFormData> = {
    title: poem.title,
    slug: poem.slug,
    description: poem.description || '',
    content: poem.content,
    categoryId: poem.categoryId || '',
    tags: poem.tags?.map((tag: any) => tag.name) || [],
    isPublished: !!poem.publishedAt,
    language: 'EN', // Default language, can be enhanced later
  };

  // Handle form submission
  const handleSubmit = async (data: PoemFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('slug', data.slug);
    if (data.description) formData.append('description', data.description);
    formData.append('content', JSON.stringify(data.content));
    if (data.categoryId) formData.append('categoryId', data.categoryId);
    formData.append('tags', JSON.stringify(data.tags));
    formData.append('isPublished', data.isPublished.toString());
    formData.append('language', data.language);

    startTransition(() => {
      formAction(formData);
    });
  };

  // Handle cancel
  const handleCancel = () => {
    router.push('/profile');
  };

  // Handle success redirect
  if (state.success) {
    router.push('/profile?success=poem_updated');
    return null;
  }

  return (
    <div>
      {state.message && !state.success && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{state.message}</p>
        </div>
      )}

      <PoemForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};
