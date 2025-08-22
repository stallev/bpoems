import { redirect } from 'next/navigation';
import { userRepository } from '@/entities/user/api/userRepository';
import { DashboardLayout } from '@/features/dashboard';
import { auth } from '@/shared/api/auth/auth';
import { RoutePath } from '@/shared/constants/RoutePath';

const DashboardRootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session?.user) {
    redirect(RoutePath.LOGIN.path);
  }

  const user = await userRepository.getUserRole(session.user.id);

  if (user?.role !== 'ADMIN') {
    redirect(RoutePath.PROFILE.path);
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardRootLayout;
