import { redirect, notFound } from 'next/navigation';
import { poemRepository } from '@/entities/poem';
import { EditPoemForm } from '@/features/poem-management/ui/PoemForm/ui/EditPoemForm';
import { auth } from '@/shared/api/auth';

// Local constants
const PAGE_LABELS = {
  TITLE: 'Edit Poem',
  DESCRIPTION: 'Update your poem content and settings',
} as const;

interface EditPoemPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const EditPoemPage = async ({ params }: EditPoemPageProps) => {
  const { slug } = await params;

  // 1. Authentication check
  const session = await auth();
  if (!session?.user) {
    redirect('/auth');
  }

  // 2. Authorization check - only authors can edit poems
  if (!['AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
    redirect('/profile?error=author_role_required');
  }

  // 3. Fetch the poem
  const poem = await poemRepository.findBySlug(slug);
  if (!poem) {
    notFound();
  }

  // 4. Check ownership (authors can only edit their own poems, moderators/admins can edit any)
  if (session.user.role === 'AUTHOR' && poem.authorId !== session.user.id) {
    redirect('/profile?error=unauthorized');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{PAGE_LABELS.TITLE}</h1>
        <p className="text-muted-foreground">{PAGE_LABELS.DESCRIPTION}</p>
      </div>

      <EditPoemForm poem={poem} />
    </div>
  );
};

export default EditPoemPage;
