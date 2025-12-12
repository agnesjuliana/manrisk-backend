import prisma from '../../config/prisma';
import { type UserProfile, type UserResponse } from '../../models/user';

export const userRepository = {
  async createUser(
    email: string,
    hashedPassword: string,
    name: string,
  ): Promise<UserResponse> {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN', // Default role saat register
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  },

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationId: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  },

  async getUserById(userId: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationId: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  },

  async getUserWithPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  },

  async emailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return user !== null;
  },

  async updateUser(
    userId: string,
    data: {
      name?: string;
      email?: string;
      organizationId?: string;
      departmentId?: string;
    },
  ): Promise<UserProfile | null> {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationId: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  },

  async deleteUser(userId: string): Promise<UserProfile | null> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationId: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  },
};
