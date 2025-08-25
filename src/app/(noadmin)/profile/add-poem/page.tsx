import { redirect } from 'next/navigation';
import { AddPoemForm } from '@/features/poem-management/ui/PoemForm/ui/AddPoemForm';
import { auth } from '@/shared/api/auth';

// Local constants
const PAGE_LABELS = {
  TITLE: 'Create New Poem',
  DESCRIPTION: 'Write and publish your new poem',
} as const;

const AddPoemPage = async () => {
  // 1. Authentication check
  const session = await auth();
  if (!session?.user) {
    redirect('/auth');
  }

  // 2. Authorization check - only authors can create poems
  if (!['AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
    redirect('/profile?error=author_role_required');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{PAGE_LABELS.TITLE}</h1>
        <p className="text-muted-foreground">{PAGE_LABELS.DESCRIPTION}</p>
      </div>

      <AddPoemForm />
    </div>
  );
};

export default AddPoemPage;
