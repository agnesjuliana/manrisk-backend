import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import {
  type CreateUserManagementRequest,
  type UpdateUserManagementRequest,
} from '../../models/organization/user-management.model';
import { userManagementService } from '../../services/organization/user-management.service';

export const userManagementController = {
  async createUser(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateUserManagementRequest;

      const result = await userManagementService.createUser(user.organizationId, data);

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

  async getUsers(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { page = 1, perPage = 10, search } = request.query;

      const pageNumber = Number.parseInt(page as string, 10) || 1;
      const perPageNumber = Number.parseInt(perPage as string, 10) || 10;
      const searchString = (search as string) || undefined;

      const result = await userManagementService.getUsers(
        user.organizationId,
        pageNumber,
        perPageNumber,
        searchString,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Daftar user berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getUserById(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await userManagementService.getUserById(user.organizationId, id);

      const customResponse = new CustomResponse(StatusCodes.OK, 'User berhasil diambil', result);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateUser(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateUserManagementRequest;

      const result = await userManagementService.updateUser(user.organizationId, id, data);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'User berhasil diperbarui',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async deleteUser(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await userManagementService.deleteUser(user.organizationId, id);

      const customResponse = new CustomResponse(StatusCodes.OK, 'User berhasil dihapus', null);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
