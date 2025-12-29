import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { type CreateControlRequest, type UpdateControlRequest } from '../../models/control';
import {
  createControlService,
  deleteControlService,
  getControlByIdService,
  getControlsService,
  updateControlService,
  getControlStatisticsService,
  getControlOptionsService,
} from '../../services/control';

export const controlController = {
  async createControl(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateControlRequest;

      const result = await createControlService(user.organizationId, data);

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Control berhasil dibuat',
        result,
      );

      response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getControls(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const search = request.query.search as string | undefined;
      const isAnnex = request.query.is_annex ? request.query.is_annex === 'true' : undefined;

      const result = await getControlsService(user.organizationId, search, isAnnex);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Data control berhasil diambil',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getControlById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await getControlByIdService(user.organizationId, id);

      if (!result) {
        throw new Error('Control tidak ditemukan');
      }

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Detail control berhasil diambil',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async updateControl(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateControlRequest;

      const result = await updateControlService(user.organizationId, id, data);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Control berhasil diubah',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async deleteControl(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await deleteControlService(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Control berhasil dihapus',
        null,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getStatistics(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };

      const result = await getControlStatisticsService(user.organizationId);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Statistik control berhasil diambil',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getOptions(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const search = request.query.search as string | undefined;

      const result = await getControlOptionsService(user.organizationId, search);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Opsi control berhasil diambil',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
