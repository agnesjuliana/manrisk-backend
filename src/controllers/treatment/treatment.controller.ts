import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { type CreateTreatmentRequest, type UpdateTreatmentRequest } from '../../models/treatment';
import {
  createTreatmentService,
  deleteTreatmentService,
  getTreatmentByIdService,
  getTreatmentsService,
  updateTreatmentService,
} from '../../services/treatment';

export const treatmentController = {
  async createTreatment(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateTreatmentRequest;

      const result = await createTreatmentService(user.organizationId, user.id, data);

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Treatment berhasil dibuat',
        result,
      );

      response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getTreatments(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const page = Number.parseInt(request.query.page as string, 10) || 1;
      const perPage = Number.parseInt(request.query.per_page as string, 10) || 10;

      const result = await getTreatmentsService(user.organizationId, page, perPage);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Treatments berhasil diambil',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getTreatmentById(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await getTreatmentByIdService(user.organizationId, id);

      if (!result) {
        throw new Error('Treatment tidak ditemukan');
      }

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Detail treatment berhasil diambil',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async updateTreatment(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateTreatmentRequest;

      const result = await updateTreatmentService(user.organizationId, id, data);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Treatment berhasil diupdate',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async deleteTreatment(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await deleteTreatmentService(user.organizationId, id);

      const customResponse = new CustomResponse(StatusCodes.OK, 'Treatment berhasil dihapus');

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
