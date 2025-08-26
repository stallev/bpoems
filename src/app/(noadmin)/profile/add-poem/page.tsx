import { redirect } from 'next/navigation';
import { PoemForm } from '@/features/poem-creation';
import { POEM_FORM_LABELS } from '@/features/poem-creation/lib/constants';
import { getCategories } from '@/features/poem-creation/server-actions/getCategories';
import { auth } from '@/shared/api/auth/auth';
import { canCreateContent } from '@/shared/lib/utils/roleUtils';
import { getRoutePath } from '@/shared/lib/utils/routeUtils';

export default async function AddPoemPage() {
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    redirect(getRoutePath('LOGIN'));
  }

  // Check if user has permission to create poems
  if (!canCreateContent(session.user.role)) {
    redirect(getRoutePath('PROFILE'));
  }

  // Get categories for the form
  const categoriesResult = await getCategories();
  if (!categoriesResult.success) {
    throw new Error(categoriesResult.message);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {POEM_FORM_LABELS.RU.CREATE_TITLE}
          </h1>
          <p className="text-muted-foreground">
            Создайте новое стихотворение, выбрав категорию и используя редактор для форматирования
            текста.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <PoemForm categories={categoriesResult.data} />
        </div>
      </div>
    </div>
  );
}
