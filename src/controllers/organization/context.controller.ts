import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import {
  type CreateContextRequest,
  type UpdateContextRequest,
} from '../../models/organization/context.model';
import { contextService } from '../../services/organization/context.service';

export const contextController = {
  async createContext(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateContextRequest;

      const result = await contextService.createContext(user.organizationId, data);

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Context berhasil dibuat',
        result,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getContexts(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { page = 1, perPage = 10, search } = request.query;

      const pageNumber = Number.parseInt(page as string, 10) || 1;
      const perPageNumber = Number.parseInt(perPage as string, 10) || 10;
      const searchString = (search as string) || undefined;

      const result = await contextService.getContexts(
        user.organizationId,
        pageNumber,
        perPageNumber,
        searchString,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Daftar context berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getContextById(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await contextService.getContextById(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Context berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateContext(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateContextRequest;

      const result = await contextService.updateContext(user.organizationId, id, data);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Context berhasil diperbarui',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async deleteContext(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await contextService.deleteContext(user.organizationId, id);

      const customResponse = new CustomResponse(StatusCodes.OK, 'Context berhasil dihapus', null);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
