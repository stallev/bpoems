import { redirect, notFound } from 'next/navigation';
import { poemRepository } from '@/entities/poem';
import { PoemFormWrapper } from '@/features/poem-creation';
import { POEM_FORM_LABELS } from '@/features/poem-creation/lib/constants';
import { getCategories } from '@/features/poem-creation/server-actions/getCategories';
import { auth } from '@/shared/api/auth/auth';
import { canCreateContent, canModerateContent } from '@/shared/lib/utils/roleUtils';
import { getRoutePath } from '@/shared/lib/utils/routeUtils';
import { RichTextContentType } from '@/shared/model/SimpleTypes';

interface EditPoemPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPoemPage({ params }: EditPoemPageProps) {
  const { slug } = await params;
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    redirect(getRoutePath('LOGIN'));
  }

  // Check if user has permission to edit poems
  if (!canCreateContent(session.user.role)) {
    redirect(getRoutePath('PROFILE'));
  }

  // Get poem by slug
  const poem = await poemRepository.getBySlug(slug);
  if (!poem) {
    notFound();
  }

  // Check ownership (only author can edit their own poems, except MODERATOR/ADMIN)
  if (poem.authorId !== session.user.id && !canModerateContent(session.user.role)) {
    redirect(getRoutePath('PROFILE'));
  }

  // Get categories for the form
  const categoriesResult = await getCategories();
  if (!categoriesResult.success) {
    throw new Error(categoriesResult.message);
  }

  // Prepare default values for the form
  const defaultValues = {
    id: poem.id,
    title: poem.title,
    slug: poem.slug,
    categoryId: poem.categoryId || '',
    content: poem.content as unknown as RichTextContentType | undefined,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {POEM_FORM_LABELS.RU.EDIT_TITLE}
          </h1>
          <p className="text-muted-foreground">
            Отредактируйте ваше стихотворение, изменив заголовок, категорию или содержимое.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <PoemFormWrapper defaultValues={defaultValues} categories={categoriesResult.data} />
        </div>
      </div>
    </div>
  );
}
