import prisma from '../../config/prisma';
import {
  type CreateContextRequest,
  type UpdateContextRequest,
  type ContextResponse,
} from '../../models/organization/context.model';
import { calculateSkip, type PaginatedResponse } from '../../utils/pagination';

export const contextRepository = {
  async createContext(
    organizationId: string,
    data: CreateContextRequest,
  ): Promise<ContextResponse> {
    const context = await prisma.context.create({
      data: {
        organizationId,
        name: data.name,
        description: data.description,
      },
      select: {
        id: true,
        organizationId: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: context.id,
      organizationId: context.organizationId,
      name: context.name,
      description: context.description,
      createdAt: context.createdAt,
      updatedAt: context.updatedAt || new Date(),
    };
  },

  async getContextsByOrganizationId(
    organizationId: string,
    page: number,
    perPage: number,
    search?: string,
  ): Promise<PaginatedResponse<ContextResponse>> {
    const skip = calculateSkip(page, perPage);

    const whereCondition: any = {
      organizationId,
      deletedAt: null,
    };

    if (search && search.trim()) {
      whereCondition.AND = [
        {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
      ];
    }

    const [contexts, totalData] = await Promise.all([
      prisma.context.findMany({
        where: whereCondition,
        select: {
          id: true,
          organizationId: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: perPage,
      }),
      prisma.context.count({
        where: whereCondition,
      }),
    ]);

    const totalPage = Math.ceil(totalData / perPage);

    return {
      data: contexts.map((context) => ({
        id: context.id,
        organizationId: context.organizationId,
        name: context.name,
        description: context.description,
        createdAt: context.createdAt,
        updatedAt: context.updatedAt || new Date(),
      })),
      metadata: {
        page,
        per_page: perPage,
        total_data: totalData,
        total_page: totalPage,
      },
    };
  },

  async getContextById(contextId: string): Promise<ContextResponse | null> {
    const context = await prisma.context.findUnique({
      where: { id: contextId },
      select: {
        id: true,
        organizationId: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!context) return null;

    return {
      id: context.id,
      organizationId: context.organizationId,
      name: context.name,
      description: context.description,
      createdAt: context.createdAt,
      updatedAt: context.updatedAt || new Date(),
    };
  },

  async updateContext(
    contextId: string,
    data: UpdateContextRequest,
  ): Promise<ContextResponse> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;

    const context = await prisma.context.update({
      where: { id: contextId },
      data: updateData,
      select: {
        id: true,
        organizationId: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: context.id,
      organizationId: context.organizationId,
      name: context.name,
      description: context.description,
      createdAt: context.createdAt,
      updatedAt: context.updatedAt || new Date(),
    };
  },

  async deleteContext(contextId: string): Promise<void> {
    await prisma.context.update({
      where: { id: contextId },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
