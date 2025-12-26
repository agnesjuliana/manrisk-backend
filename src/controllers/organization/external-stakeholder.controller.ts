import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import {
  type CreateExternalStakeholderRequest,
  type UpdateExternalStakeholderRequest,
} from '../../models/organization/external-stakeholder.model';
import { externalStakeholderService } from '../../services/organization/external-stakeholder.service';

export const externalStakeholderController = {
  async createExternalStakeholder(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateExternalStakeholderRequest;

      const result = await externalStakeholderService.createExternalStakeholder(
        user.organizationId,
        data,
      );

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'External Stakeholder berhasil dibuat',
        result,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getExternalStakeholders(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { page = 1, perPage = 10, search } = request.query;

      const pageNumber = Number.parseInt(page as string, 10) || 1;
      const perPageNumber = Number.parseInt(perPage as string, 10) || 10;
      const searchString = (search as string) || undefined;

      const result = await externalStakeholderService.getExternalStakeholders(
        user.organizationId,
        pageNumber,
        perPageNumber,
        searchString,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Daftar external stakeholder berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getExternalStakeholderById(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await externalStakeholderService.getExternalStakeholderById(
        user.organizationId,
        id,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'External Stakeholder berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateExternalStakeholder(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateExternalStakeholderRequest;

      const result = await externalStakeholderService.updateExternalStakeholder(
        user.organizationId,
        id,
        data,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'External Stakeholder berhasil diperbarui',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async deleteExternalStakeholder(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await externalStakeholderService.deleteExternalStakeholder(
        user.organizationId,
        id,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'External Stakeholder berhasil dihapus',
        null,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
