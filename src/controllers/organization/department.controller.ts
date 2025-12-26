import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import {
  type CreateDepartmentRequest,
  type UpdateDepartmentRequest,
} from '../../models/organization/department.model';
import { departmentService } from '../../services/organization/department.service';

export const departmentController = {
  async createDepartment(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateDepartmentRequest;

      const result = await departmentService.createDepartment(user.organizationId, data);

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Departemen berhasil dibuat',
        result,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getDepartments(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { page = 1, perPage = 10, search } = request.query;

      const pageNumber = Number.parseInt(page as string, 10) || 1;
      const perPageNumber = Number.parseInt(perPage as string, 10) || 10;
      const searchString = (search as string) || undefined;

      const result = await departmentService.getDepartments(
        user.organizationId,
        pageNumber,
        perPageNumber,
        searchString,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Daftar departemen berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getDepartmentById(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await departmentService.getDepartmentById(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Departemen berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateDepartment(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateDepartmentRequest;

      const result = await departmentService.updateDepartment(user.organizationId, id, data);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Departemen berhasil diperbarui',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async deleteDepartment(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await departmentService.deleteDepartment(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Departemen berhasil dihapus',
        null,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
