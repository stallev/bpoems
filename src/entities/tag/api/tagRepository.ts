import { prisma } from '@/shared/api/database/prisma';
import type { Tag, CreateTagData, UpdateTagData } from '../model/types';

class TagRepository {
  async findById(id: string): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { name },
    });
  }

  async findByNameId(nameId: string): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { nameId },
    });
  }

  async findAll(): Promise<Tag[]> {
    return prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(data: CreateTagData): Promise<Tag> {
    return prisma.tag.create({
      data,
    });
  }

  async update(id: string, data: UpdateTagData): Promise<Tag> {
    return prisma.tag.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Tag> {
    return prisma.tag.delete({
      where: { id },
    });
  }

  async findManyByIds(ids: string[]): Promise<Tag[]> {
    return prisma.tag.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findPopularTags(limit: number = 10): Promise<Tag[]> {
    return prisma.tag.findMany({
      take: limit,
      orderBy: {
        poems: {
          _count: 'desc',
        },
      },
    });
  }
}

export const tagRepository = new TagRepository();
