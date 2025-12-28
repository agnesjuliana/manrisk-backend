import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { type CreateSOARequest, type UpdateSOARequest } from '../../models/soa';
import {
  createSOAService,
  deleteSOAService,
  getSOAByIdService,
  getSOAsService,
  updateSOAService,
} from '../../services/soa';

export const soaController = {
  async createSOA(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateSOARequest;

      const result = await createSOAService(user.organizationId, data);

      const customResponse = new CustomResponse(StatusCodes.CREATED, 'SOA berhasil dibuat', result);

      response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getSOAs(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const page = Number.parseInt(request.query.page as string, 10) || 1;
      const perPage = Number.parseInt(request.query.per_page as string, 10) || 10;
      const search = request.query.search as string | undefined;
      const status = request.query.status as string | undefined;

      const result = await getSOAsService(user.organizationId, page, perPage, search, status);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Data SOA berhasil diambil',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getSOAById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await getSOAByIdService(user.organizationId, id);

      if (!result) {
        throw new Error('SOA tidak ditemukan');
      }

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Detail SOA berhasil diambil',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async updateSOA(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateSOARequest;

      const result = await updateSOAService(user.organizationId, id, data);

      const customResponse = new CustomResponse(StatusCodes.OK, 'SOA berhasil diubah', result);

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async deleteSOA(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await deleteSOAService(user.organizationId, id);

      const customResponse = new CustomResponse(StatusCodes.OK, 'SOA berhasil dihapus', null);

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
