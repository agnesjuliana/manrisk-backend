import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../../middleware';
import {
  type CreateUserManagementRequest,
  type UpdateUserManagementRequest,
  type UserManagementResponse,
} from '../../models/organization/user-management.model';
import { userManagementRepository } from '../../repositories/organization/user-management.repository';
import { validatePaginationParameters, type PaginatedResponse } from '../../utils/pagination';

export const userManagementService = {
  async createUser(
    organizationId: string,
    data: CreateUserManagementRequest,
  ): Promise<UserManagementResponse> {
    // Check if email already exists
    const existingUser = await userManagementRepository.getUserByEmail(data.email);

    if (existingUser) {
      throw new CustomError(StatusCodes.BAD_REQUEST, 'Email sudah terdaftar');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userManagementRepository.createUser(organizationId, {
      ...data,
      password: hashedPassword,
    });

    return user;
  },

  async getUsers(
    organizationId: string,
    page: number = 1,
    perPage: number = 10,
    search?: string,
  ): Promise<PaginatedResponse<UserManagementResponse>> {
    if (!organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'User harus memiliki organisasi');
    }

    const { page: validPage, perPage: validPerPage } = validatePaginationParameters(
      page,
      perPage,
    );

    const result = await userManagementRepository.getUsersByOrganizationId(
      organizationId,
      validPage,
      validPerPage,
      search,
    );

    return result;
  },

  async getUserById(
    organizationId: string,
    userId: string,
  ): Promise<UserManagementResponse> {
    const user = await userManagementRepository.getUserById(userId);

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    if (user.organizationId !== organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'Anda tidak memiliki akses ke user ini');
    }

    return user;
  },

  async updateUser(
    organizationId: string,
    userId: string,
    data: UpdateUserManagementRequest,
  ): Promise<UserManagementResponse> {
    const user = await userManagementRepository.getUserById(userId);

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    if (user.organizationId !== organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'Anda tidak memiliki akses ke user ini');
    }

    // Check if new email already exists (if email is being updated)
    if (data.email && data.email !== user.email) {
      const existingUser = await userManagementRepository.getUserByEmail(data.email);

      if (existingUser) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'Email sudah terdaftar');
      }
    }

    // Hash password if provided
    const updateData = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await userManagementRepository.updateUser(userId, updateData);

    return updated;
  },

  async deleteUser(organizationId: string, userId: string): Promise<void> {
    const user = await userManagementRepository.getUserById(userId);

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    if (user.organizationId !== organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'Anda tidak memiliki akses ke user ini');
    }

    await userManagementRepository.deleteUser(userId);
  },
};

