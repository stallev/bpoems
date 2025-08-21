import { redirect } from 'next/navigation';
import { userRepository } from '@/entities/user/api/userRepository';
import { auth } from '@/shared/api/auth/auth';
import { RoutePath } from '@/shared/constants/RoutePath';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session?.user) {
    redirect(RoutePath.LOGIN.path);
  }

  const user = await userRepository.getUserRole(session.user.id);

  if (user?.role !== 'ADMIN') {
    redirect(RoutePath.PROFILE.path);
  }

  return <>{children}</>;
};

export default DashboardLayout;
