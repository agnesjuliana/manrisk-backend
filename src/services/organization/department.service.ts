import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../../middleware';
import {
  type CreateDepartmentRequest,
  type UpdateDepartmentRequest,
  type DepartmentResponse,
} from '../../models/organization/department.model';
import { departmentRepository } from '../../repositories/organization/department.repository';
import { validatePaginationParams as validatePaginationParameters, type PaginatedResponse } from '../../utils/pagination';

export const departmentService = {
  async createDepartment(
    organizationId: string,
    data: CreateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    const department = await departmentRepository.createDepartment(organizationId, data);

    return department;
  },

  async getDepartments(
    organizationId: string,
    page: number = 1,
    perPage: number = 10,
    search?: string,
  ): Promise<PaginatedResponse<DepartmentResponse>> {
    if (!organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'User harus memiliki organisasi');
    }

    const { page: validPage, perPage: validPerPage } = validatePaginationParameters(page, perPage);

    const result = await departmentRepository.getDepartmentsByOrganizationId(
      organizationId,
      validPage,
      validPerPage,
      search,
    );

    return result;
  },

  async getDepartmentById(
    organizationId: string,
    departmentId: string,
  ): Promise<DepartmentResponse> {
    const department = await departmentRepository.getDepartmentById(departmentId);

    if (!department) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Departemen tidak ditemukan');
    }

    if (department.organizationId !== organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'Anda tidak memiliki akses ke departemen ini');
    }

    return department;
  },

  async updateDepartment(
    organizationId: string,
    departmentId: string,
    data: UpdateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    const department = await departmentRepository.getDepartmentById(departmentId);

    if (!department) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Departemen tidak ditemukan');
    }

    if (department.organizationId !== organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'Anda tidak memiliki akses ke departemen ini');
    }

    const updated = await departmentRepository.updateDepartment(departmentId, data);

    return updated;
  },

  async deleteDepartment(organizationId: string, departmentId: string): Promise<void> {
    const department = await departmentRepository.getDepartmentById(departmentId);

    if (!department) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Departemen tidak ditemukan');
    }

    if (department.organizationId !== organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'Anda tidak memiliki akses ke departemen ini');
    }

    await departmentRepository.deleteDepartment(departmentId);
  },
};
