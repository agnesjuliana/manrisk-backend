import prisma from '../../config/prisma';
import {
  type CreateUserManagementRequest,
  type UpdateUserManagementRequest,
  type UserManagementResponse,
} from '../../models/organization/user-management.model';
import { calculateSkip, type PaginatedResponse } from '../../utils/pagination';

export const userManagementRepository = {
  async createUser(
    organizationId: string,
    data: CreateUserManagementRequest & { password: string },
  ): Promise<UserManagementResponse> {
    const user = await prisma.user.create({
      data: {
        organizationId,
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        departmentId: data.division_id,
      },
      select: {
        id: true,
        organizationId: true,
        name: true,
        email: true,
        role: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: user.id,
      organizationId: user.organizationId,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt || new Date(),
    };
  },

  async getUsersByOrganizationId(
    organizationId: string,
    page: number,
    perPage: number,
    search?: string,
  ): Promise<PaginatedResponse<UserManagementResponse>> {
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
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
      ];
    }

    const [users, totalData] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        select: {
          id: true,
          organizationId: true,
          name: true,
          email: true,
          role: true,
          departmentId: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: perPage,
      }),
      prisma.user.count({
        where: whereCondition,
      }),
    ]);

    const totalPage = Math.ceil(totalData / perPage);

    return {
      data: users.map((user) => ({
        id: user.id,
        organizationId: user.organizationId,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId || undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt || new Date(),
      })),
      metadata: {
        page,
        per_page: perPage,
        total_data: totalData,
        total_page: totalPage,
      },
    };
  },

  async getUserById(userId: string): Promise<UserManagementResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        organizationId: true,
        name: true,
        email: true,
        role: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      organizationId: user.organizationId,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt || new Date(),
    };
  },

  async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  },

  async updateUser(
    userId: string,
    data: UpdateUserManagementRequest & { password?: string },
  ): Promise<UserManagementResponse> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.password !== undefined) updateData.password = data.password;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.division_id !== undefined) updateData.departmentId = data.division_id;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        organizationId: true,
        name: true,
        email: true,
        role: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: user.id,
      organizationId: user.organizationId,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt || new Date(),
    };
  },

  async deleteUser(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
