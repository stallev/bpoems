import { PrismaClient } from '@/generated/prisma';

declare global {
  var prisma: PrismaClient | undefined;
}

// Предотвращение создания множества экземпляров PrismaClient в режиме разработки
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
