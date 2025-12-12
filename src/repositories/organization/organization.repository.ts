import { type Prisma } from '@prisma/client';

import prisma from '../../config/prisma';

export const organizationRepository = {
  async createOrganization(data: Prisma.OrganizationCreateInput) {
    return await prisma.organization.create({
      data,
    });
  },

  async getOrganizationById(organizationId: string) {
    return await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        departments: {
          where: { deletedAt: null },
        },
        users: {
          where: { deletedAt: null },
        },
      },
    });
  },

  async getOrganizationWithDetails(organizationId: string) {
    return await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        departments: {
          where: { deletedAt: null },
          include: {
            users: {
              where: { deletedAt: null },
            },
          },
        },
        users: {
          where: { deletedAt: null },
        },
      },
    });
  },

  async updateOrganization(
    organizationId: string,
    data: Prisma.OrganizationUpdateInput,
  ) {
    return await prisma.organization.update({
      where: { id: organizationId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  },

  async deleteOrganization(organizationId: string) {
    return await prisma.organization.update({
      where: { id: organizationId },
      data: {
        deletedAt: new Date(),
      },
    });
  },

  async getDepartments(organizationId: string) {
    return await prisma.department.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        users: {
          where: { deletedAt: null },
        },
      },
    });
  },

  async getDepartmentById(departmentId: string) {
    return await prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        users: {
          where: { deletedAt: null },
        },
      },
    });
  },

  async createDepartment(data: Prisma.DepartmentCreateInput) {
    return await prisma.department.create({
      data,
    });
  },

  async updateDepartment(
    departmentId: string,
    data: Prisma.DepartmentUpdateInput,
  ) {
    return await prisma.department.update({
      where: { id: departmentId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  },

  async deleteDepartment(departmentId: string) {
    return await prisma.department.update({
      where: { id: departmentId },
      data: {
        deletedAt: new Date(),
      },
    });
  },


  async getUsersInOrganization(organizationId: string) {
    return await prisma.user.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        department: true,
      },
    });
  },

  async getUsersInDepartment(departmentId: string) {
    return await prisma.user.findMany({
      where: {
        departmentId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        departmentId: true,
        createdAt: true,
      },
    });
  },


  async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: true,
      },
    });
  },

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },


  async createUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
      include: {
        department: true,
      },
    });
  },


  async updateUser(userId: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        department: true,
      },
    });
  },

  async deleteUser(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });
  },

  async emailExistsInOrganization(email: string, organizationId: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        organizationId,
        deletedAt: null,
      },
    });

    return !!user;
  },

  async departmentExistsInOrganization(
    departmentId: string,
    organizationId: string,
  ) {
    const department = await prisma.department.findFirst({
      where: {
        id: departmentId,
        organizationId,
        deletedAt: null,
      },
    });

    return !!department;
  },
};
