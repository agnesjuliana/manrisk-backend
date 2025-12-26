import prisma from '../../config/prisma';
import {
  type CreateExternalStakeholderRequest,
  type UpdateExternalStakeholderRequest,
  type ExternalStakeholderResponse,
} from '../../models/organization/external-stakeholder.model';
import { calculateSkip, type PaginatedResponse } from '../../utils/pagination';

export const externalStakeholderRepository = {
  async createExternalStakeholder(
    organizationId: string,
    data: CreateExternalStakeholderRequest,
  ): Promise<ExternalStakeholderResponse> {
    const stakeholder = await prisma.externalStakeholder.create({
      data: {
        organizationId,
        name: data.name,
        interest: data.interest,
      },
      select: {
        id: true,
        organizationId: true,
        name: true,
        interest: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: stakeholder.id,
      organizationId: stakeholder.organizationId,
      name: stakeholder.name,
      interest: stakeholder.interest,
      createdAt: stakeholder.createdAt,
      updatedAt: stakeholder.updatedAt || new Date(),
    };
  },

  async getExternalStakeholdersByOrganizationId(
    organizationId: string,
    page: number,
    perPage: number,
    search?: string,
  ): Promise<PaginatedResponse<ExternalStakeholderResponse>> {
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
              interest: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
      ];
    }

    const [stakeholders, totalData] = await Promise.all([
      prisma.externalStakeholder.findMany({
        where: whereCondition,
        select: {
          id: true,
          organizationId: true,
          name: true,
          interest: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: perPage,
      }),
      prisma.externalStakeholder.count({
        where: whereCondition,
      }),
    ]);

    const totalPage = Math.ceil(totalData / perPage);

    return {
      data: stakeholders.map((stakeholder) => ({
        id: stakeholder.id,
        organizationId: stakeholder.organizationId,
        name: stakeholder.name,
        interest: stakeholder.interest,
        createdAt: stakeholder.createdAt,
        updatedAt: stakeholder.updatedAt || new Date(),
      })),
      metadata: {
        page,
        per_page: perPage,
        total_data: totalData,
        total_page: totalPage,
      },
    };
  },

  async getExternalStakeholderById(
    stakeholderId: string,
  ): Promise<ExternalStakeholderResponse | null> {
    const stakeholder = await prisma.externalStakeholder.findUnique({
      where: { id: stakeholderId },
      select: {
        id: true,
        organizationId: true,
        name: true,
        interest: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!stakeholder) return null;

    return {
      id: stakeholder.id,
      organizationId: stakeholder.organizationId,
      name: stakeholder.name,
      interest: stakeholder.interest,
      createdAt: stakeholder.createdAt,
      updatedAt: stakeholder.updatedAt || new Date(),
    };
  },

  async updateExternalStakeholder(
    stakeholderId: string,
    data: UpdateExternalStakeholderRequest,
  ): Promise<ExternalStakeholderResponse> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.interest !== undefined) updateData.interest = data.interest;

    const stakeholder = await prisma.externalStakeholder.update({
      where: { id: stakeholderId },
      data: updateData,
      select: {
        id: true,
        organizationId: true,
        name: true,
        interest: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: stakeholder.id,
      organizationId: stakeholder.organizationId,
      name: stakeholder.name,
      interest: stakeholder.interest,
      createdAt: stakeholder.createdAt,
      updatedAt: stakeholder.updatedAt || new Date(),
    };
  },

  async deleteExternalStakeholder(stakeholderId: string): Promise<void> {
    await prisma.externalStakeholder.update({
      where: { id: stakeholderId },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
