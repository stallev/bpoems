import { prisma } from '@/shared/api/database/prisma';
import type {
  User,
  UserCreateInput,
  UserUpdateInput,
  UserOrderByWithRelationInput,
  UserWhereInput,
  UserWithRelations,
  SimpleUserCreateInput,
  SimpleUserUpdateInput,
  UserRole,
  UserBioInput,
} from '../model/types';

export const userRepository = {
  findById: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  getUserRole: async (id: string): Promise<{ role: UserRole } | null> => {
    return prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
  },

  findByEmail: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findAll: async (params?: {
    skip?: number;
    take?: number;
    orderBy?: UserOrderByWithRelationInput;
    where?: UserWhereInput;
  }): Promise<User[]> => {
    const { skip, take, orderBy, where } = params || {};

    return prisma.user.findMany({
      skip,
      take,
      orderBy,
      where,
    });
  },

  create: async (data: SimpleUserCreateInput | UserCreateInput): Promise<User> => {
    return prisma.user.create({
      data: data as UserCreateInput,
    });
  },

  update: async (id: string, data: SimpleUserUpdateInput | UserUpdateInput): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data: data as UserUpdateInput,
    });
  },

  updateBio: async (id: string, bio: UserBioInput): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data: { bio },
    });
  },

  getBio: async (id: string): Promise<User['bio'] | null> => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { bio: true },
    });
    return user?.bio ?? null;
  },

  delete: async (id: string): Promise<User> => {
    return prisma.user.delete({
      where: { id },
    });
  },

  // Additional methods for working with related data
  findWithPoems: async (id: string): Promise<UserWithRelations | null> => {
    return prisma.user.findUnique({
      where: { id },
      include: {
        poems: true,
      },
    }) as Promise<UserWithRelations | null>;
  },

  findWithComments: async (id: string): Promise<UserWithRelations | null> => {
    return prisma.user.findUnique({
      where: { id },
      include: {
        comments: true,
      },
    }) as Promise<UserWithRelations | null>;
  },
};
