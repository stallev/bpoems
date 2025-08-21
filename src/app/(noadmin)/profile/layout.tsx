import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { auth } from '@/shared/api/auth/auth';
import { RoutePath } from '@/shared/constants/RoutePath';

const ProfileLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session?.user) {
    redirect(RoutePath.LOGIN.path);
  }

  return <>{children}</>;
};

export default ProfileLayout;
