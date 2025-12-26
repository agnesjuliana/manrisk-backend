import prisma from '../../config/prisma';
import {
  type CreateDepartmentRequest,
  type UpdateDepartmentRequest,
  type DepartmentResponse,
} from '../../models/organization/department.model';
import { calculateSkip, type PaginatedResponse } from '../../utils/pagination';

export const departmentRepository = {
  async createDepartment(
    organizationId: string,
    data: CreateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    const department = await prisma.department.create({
      data: {
        organizationId,
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
      },
      select: {
        id: true,
        organizationId: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return department;
  },

  async getDepartmentsByOrganizationId(
    organizationId: string,
    page: number,
    perPage: number,
    search?: string,
  ): Promise<PaginatedResponse<DepartmentResponse>> {
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

    const [departments, totalData] = await Promise.all([
      prisma.department.findMany({
        where: whereCondition,
        select: {
          id: true,
          organizationId: true,
          name: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: perPage,
      }),
      prisma.department.count({
        where: whereCondition,
      }),
    ]);

    const totalPage = Math.ceil(totalData / perPage);

    return {
      data: departments,
      metadata: {
        page,
        per_page: perPage,
        total_data: totalData,
        total_page: totalPage,
      },
    };
  },

  async getDepartmentById(departmentId: string): Promise<DepartmentResponse | null> {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      select: {
        id: true,
        organizationId: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!department) return null;

    return department;
  },

  async updateDepartment(
    departmentId: string,
    data: UpdateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const department = await prisma.department.update({
      where: { id: departmentId },
      data: updateData,
      select: {
        id: true,
        organizationId: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return department;
  },

  async deleteDepartment(departmentId: string): Promise<void> {
    await prisma.department.update({
      where: { id: departmentId },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
