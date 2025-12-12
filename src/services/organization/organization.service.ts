import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../../middleware/error.middleware';
import { organizationRepository } from '../../repositories/organization';
import {
  type CreateDepartmentRequest,
  type UpdateDepartmentRequest,
} from '../../validators/organization/manage-division.validator';
import {
  type CreateUserRequest,
  type UpdateUserRequest,
} from '../../validators/organization/manage-user.validator';
import { type RegisterOrganizationRequest } from '../../validators/organization/register-organization.validator';
import { type UpdateOrganizationRequest } from '../../validators/organization/update-organization.validator';

/**
 * Organization Service
 * Business logic untuk organization management
 */
export const organizationService = {
  /**
   * Register organization baru dengan admin user
   */
  async registerOrganization(data: RegisterOrganizationRequest) {
    const existingUser = await organizationRepository.getUserByEmail(data.adminEmail);

    if (existingUser) {
      throw new CustomError(StatusCodes.CONFLICT, 'Email sudah terdaftar');
    }

    const organization = await organizationRepository.createOrganization({
      name: data.name,
      address: data.address,
      email: data.email,
      noTelp: data.noTelp,
    });

    const adminUser = await organizationRepository.createUser({
      email: data.adminEmail,
      name: data.adminName,
      password: data.adminPassword,
      role: 'ADMIN',
      organization: {
        connect: { id: organization.id },
      },
    });

    return {
      organization,
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
    };
  },

  /**
   * Get organization profile
   */
  async getOrganizationProfile(organizationId: string) {
    const organization = await organizationRepository.getOrganizationWithDetails(organizationId);

    if (!organization) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Organisasi tidak ditemukan');
    }

    return organization;
  },

  /**
   * Update organization profile
   */
  async updateOrganizationProfile(organizationId: string, data: UpdateOrganizationRequest) {
    const organization = await organizationRepository.getOrganizationById(organizationId);

    if (!organization) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Organisasi tidak ditemukan');
    }

    const updated = await organizationRepository.updateOrganization(organizationId, data);

    return updated;
  },

  /**
   * Create department dalam organization
   */
  async createDepartment(organizationId: string, data: CreateDepartmentRequest) {
    const organization = await organizationRepository.getOrganizationById(organizationId);

    if (!organization) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Organisasi tidak ditemukan');
    }

    const department = await organizationRepository.createDepartment({
      name: data.name,
      description: data.description || '',
      isActive: data.isActive ?? true,
      organization: {
        connect: { id: organizationId },
      },
    });

    return department;
  },

  /**
   * Get all departments dalam organization
   */
  async getDepartments(organizationId: string) {
    const organization = await organizationRepository.getOrganizationById(organizationId);

    if (!organization) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Organisasi tidak ditemukan');
    }

    const departments = await organizationRepository.getDepartments(organizationId);

    return departments;
  },

  /**
   * Update department
   */
  async updateDepartment(
    departmentId: string,
    organizationId: string,
    data: UpdateDepartmentRequest,
  ) {
    // Verify department exists in organization
    const deptExists = await organizationRepository.departmentExistsInOrganization(
      departmentId,
      organizationId,
    );

    if (!deptExists) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Divisi tidak ditemukan');
    }

    const updated = await organizationRepository.updateDepartment(departmentId, data);

    return updated;
  },

  /**
   * Delete department (soft delete)
   */
  async deleteDepartment(departmentId: string, organizationId: string) {
    // Verify department exists in organization
    const deptExists = await organizationRepository.departmentExistsInOrganization(
      departmentId,
      organizationId,
    );

    if (!deptExists) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Divisi tidak ditemukan');
    }

    // Check if there are users in department
    const users = await organizationRepository.getUsersInDepartment(departmentId);

    if (users.length > 0) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        'Tidak bisa menghapus divisi yang masih memiliki pengguna',
      );
    }

    const deleted = await organizationRepository.deleteDepartment(departmentId);

    return deleted;
  },

  /**
   * Create user dalam organization
   */
  async createUser(organizationId: string, data: CreateUserRequest) {
    const organization = await organizationRepository.getOrganizationById(organizationId);

    if (!organization) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Organisasi tidak ditemukan');
    }

    // Check email not exists
    const emailExists = await organizationRepository.emailExistsInOrganization(
      data.email,
      organizationId,
    );

    if (emailExists) {
      throw new CustomError(StatusCodes.CONFLICT, 'Email sudah ada dalam organisasi');
    }

    // Validate department if provided
    if (data.departmentId) {
      const deptExists = await organizationRepository.departmentExistsInOrganization(
        data.departmentId,
        organizationId,
      );

      if (!deptExists) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Divisi tidak ditemukan');
      }
    }

    // Risk Owner dan Risk Manager harus punya department
    if ((data.role === 'RISK_OWNER' || data.role === 'RISK_MANAGER') && !data.departmentId) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        'Risk Owner dan Risk Manager harus di-assign ke divisi',
      );
    }

    const user = await organizationRepository.createUser({
      email: data.email,
      name: data.name,
      password: 'temp_password_' + Date.now(), // TODO: Generate secure temporary password
      role: data.role,
      organization: {
        connect: { id: organizationId },
      },
      ...(data.departmentId && {
        department: {
          connect: { id: data.departmentId },
        },
      }),
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      departmentId: user.departmentId,
    };
  },

  /**
   * Get all users dalam organization
   */
  async getUsersInOrganization(organizationId: string) {
    const organization = await organizationRepository.getOrganizationById(organizationId);

    if (!organization) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Organisasi tidak ditemukan');
    }

    const users = await organizationRepository.getUsersInOrganization(organizationId);

    return users.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      departmentId: user.departmentId,
      department: user.department,
    }));
  },

  /**
   * Update user
   */
  async updateUser(userId: string, organizationId: string, data: UpdateUserRequest) {
    const user = await organizationRepository.getUserById(userId);

    if (!user || user.organizationId !== organizationId) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Pengguna tidak ditemukan');
    }

    // If changing email, check it doesn't exist
    if (data.email && data.email !== user.email) {
      const emailExists = await organizationRepository.emailExistsInOrganization(
        data.email,
        organizationId,
      );

      if (emailExists) {
        throw new CustomError(StatusCodes.CONFLICT, 'Email sudah ada dalam organisasi');
      }
    }

    // If changing department, validate it
    if (data.departmentId && data.departmentId !== user.departmentId) {
      const deptExists = await organizationRepository.departmentExistsInOrganization(
        data.departmentId,
        organizationId,
      );

      if (!deptExists) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Divisi tidak ditemukan');
      }
    }

    const updated = await organizationRepository.updateUser(userId, data);

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      departmentId: updated.departmentId,
    };
  },

  /**
   * Delete user (soft delete)
   */
  async deleteUser(userId: string, organizationId: string) {
    const user = await organizationRepository.getUserById(userId);

    if (!user || user.organizationId !== organizationId) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Pengguna tidak ditemukan');
    }

    // Cannot delete last admin
    const usersInOrg = await organizationRepository.getUsersInOrganization(organizationId);
    const admins = usersInOrg.filter((u: any) => u.role === 'ADMIN' && !u.deletedAt);

    if (user.role === 'ADMIN' && admins.length === 1) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        'Tidak bisa menghapus admin terakhir dalam organisasi',
      );
    }

    const deleted = await organizationRepository.deleteUser(userId);

    return deleted;
  },
};
