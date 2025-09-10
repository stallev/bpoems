import { useSession } from 'next-auth/react';

export const useGetSessionData = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const user = session?.user;

  return user;
};
