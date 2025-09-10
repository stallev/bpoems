import { useGetSessionData } from './useGetSessionData';

export const useCheckIsAuthor = (authorId: string) => {
  const user = useGetSessionData();
  return user?.id === authorId;
};
