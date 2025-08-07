// Import types from generated Prisma Client
import type { User as PrismaUser, Role, Prisma } from '@/generated/prisma';

// Re-export base types from Prisma
export type User = PrismaUser;
export type UserRole = Role;
export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;
export type UserWhereInput = Prisma.UserWhereInput;
export type UserOrderByWithRelationInput = Prisma.UserOrderByWithRelationInput;

// Extended type for user with additional fields or relations
export interface UserWithRelations extends PrismaUser {
  poems?: {
    id: string;
    title: string;
    published: boolean;
  }[];
  comments?: {
    id: string;
    content: string;
    poemId: string;
  }[];
}

// Simplified types for more convenient use in the application
export type SimpleUserCreateInput = Omit<
  Prisma.UserUncheckedCreateInput,
  'poems' | 'comments' | 'accounts' | 'sessions'
> & {
  password?: string | null;
};

export type SimpleUserUpdateInput = Omit<
  Prisma.UserUncheckedUpdateInput,
  'poems' | 'comments' | 'accounts' | 'sessions'
> & {
  password?: string | null;
};
