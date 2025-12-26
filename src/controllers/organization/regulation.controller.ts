import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import {
  type CreateRegulationRequest,
  type UpdateRegulationRequest,
} from '../../models/organization/regulation.model';
import { regulationService } from '../../services/organization/regulation.service';

export const regulationController = {
  async getRegulations(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };

      const result = await regulationService.getRegulations(user.organizationId);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Regulasi berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getRegulationById(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await regulationService.getRegulationById(
        id,
        user.organizationId,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Regulasi berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async createRegulation(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateRegulationRequest;

      const result = await regulationService.createRegulation(
        user.organizationId,
        data,
      );

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Regulasi berhasil dibuat',
        result,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateRegulation(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateRegulationRequest;

      const result = await regulationService.updateRegulation(
        id,
        user.organizationId,
        data,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Regulasi berhasil diperbarui',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async deleteRegulation(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await regulationService.deleteRegulation(id, user.organizationId);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Regulasi berhasil dihapus',
        null,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
