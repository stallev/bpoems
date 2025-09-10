import { loadPoemData } from '@/entities/poem/api/loadPoemdata';
import { PoemContent } from '@/entities/poem/view/PoemContent';
import { auth } from '@/shared/api/auth/auth';

import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { DynamicPagePathProps } from '@/shared/model/PagesPropsTypes';

export default async function PoemPage({ params }: DynamicPagePathProps) {
  const { slug } = await params;

  try {
    const { poem, author } = await loadPoemData(slug);
    const session = await auth();
    const currentUserId = session?.user?.id;
    console.log('fetched poemRepository', JSON.stringify(poem, null, 2));

    return (
      <div className="container mx-auto px-4 py-8">
        <PoemContent poem={poem} author={author} currentUserId={currentUserId} />
      </div>
    );
  } catch (error) {
    console.error('Error loading poem page:', error);
    throw new Error(ErrorMessages.PAGE_LOAD_FAILED);
  }
}
