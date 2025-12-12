import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { organizationService } from '../../services/organization/organization.service';
import {
  type RegisterOrganizationRequest,
  type UpdateOrganizationRequest,
  type CreateDepartmentRequest,
  type UpdateDepartmentRequest,
  type CreateUserRequest,
  type UpdateUserRequest,
} from '../../validators/organization';

export const organizationController = {
  // ===== ORGANIZATION MANAGEMENT =====

  async registerOrganization(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await organizationService.registerOrganization(
        request.body as RegisterOrganizationRequest,
      );
      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Organisasi dan admin user berhasil dibuat',
        result,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getOrganizationProfile(request: Request, response: Response, next: NextFunction) {
    try {
      const { organizationId } = request.params;
      const result = await organizationService.getOrganizationProfile(organizationId);
      const customResponse = new CustomResponse(StatusCodes.OK, 'Profil organisasi', result);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateOrganizationProfile(request: Request, response: Response, next: NextFunction) {
    try {
      const { organizationId } = request.params;
      const result = await organizationService.updateOrganizationProfile(
        organizationId,
        request.body as UpdateOrganizationRequest,
      );
      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Profil organisasi diperbarui',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  // ===== DEPARTMENT MANAGEMENT =====

  async createDepartment(request: Request, response: Response, next: NextFunction) {
    try {
      const { organizationId } = request.params;
      const result = await organizationService.createDepartment(
        organizationId,
        request.body as CreateDepartmentRequest,
      );
      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Divisi berhasil dibuat',
        result,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getDepartments(request: Request, response: Response, next: NextFunction) {
    try {
      const { organizationId } = request.params;
      const result = await organizationService.getDepartments(organizationId);
      const customResponse = new CustomResponse(StatusCodes.OK, 'Daftar divisi', result);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateDepartment(request: Request, response: Response, next: NextFunction) {
    try {
      const { organizationId, departmentId } = request.params;
      const result = await organizationService.updateDepartment(
        departmentId,
        organizationId,
        request.body as UpdateDepartmentRequest,
      );
      const customResponse = new CustomResponse(StatusCodes.OK, 'Divisi diperbarui', result);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async deleteDepartment(request: Request, response: Response, next: NextFunction) {
    try {
      const { organizationId, departmentId } = request.params;
      const result = await organizationService.deleteDepartment(departmentId, organizationId);
      const customResponse = new CustomResponse(StatusCodes.OK, 'Divisi dihapus', result);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  // ===== USER MANAGEMENT =====

  async createUser(request: Request, response: Response, next: NextFunction) {
    try {
      const { organizationId } = request.params;
      const result = await organizationService.createUser(
        organizationId,
        request.body as CreateUserRequest,
      );
      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'User berhasil dibuat',
        result,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getUsersInOrganization(request: Request, response: Response, next: NextFunction) {
    try {
      const { organizationId } = request.params;
      const result = await organizationService.getUsersInOrganization(organizationId);
      const customResponse = new CustomResponse(StatusCodes.OK, 'Daftar user', result);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateUser(request: Request, response: Response, next: NextFunction) {
    try {
      const { organizationId, userId } = request.params;
      const result = await organizationService.updateUser(
        userId,
        organizationId,
        request.body as UpdateUserRequest,
      );
      const customResponse = new CustomResponse(StatusCodes.OK, 'User diperbarui', result);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async deleteUser(request: Request, response: Response, next: NextFunction) {
    try {
      const { organizationId, userId } = request.params;
      const result = await organizationService.deleteUser(userId, organizationId);
      const customResponse = new CustomResponse(StatusCodes.OK, 'User dihapus', result);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
