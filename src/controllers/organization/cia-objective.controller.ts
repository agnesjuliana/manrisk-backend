import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import {
  type UpsertCIAObjectiveRequest,
  type CreateServicePriorityRequest,
  type UpdateServicePriorityRequest,
} from '../../models/organization/cia-objective.model';
import { ciaObjectiveService } from '../../services/organization/cia-objective.service';

export const ciaObjectiveController = {
  async upsertCIAObjective(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as UpsertCIAObjectiveRequest;

      const result = await ciaObjectiveService.upsertCIAObjective(
        user.organizationId,
        data,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'CIA Objective berhasil disimpan',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getCIAObjective(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };

      const result = await ciaObjectiveService.getCIAObjectiveWithPriorities(
        user.organizationId,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'CIA Objective berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async createServicePriority(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateServicePriorityRequest;

      const result = await ciaObjectiveService.createServicePriority(
        user.organizationId,
        data,
      );

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Service Priority berhasil dibuat',
        result,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getServicePriorityById(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await ciaObjectiveService.getServicePriorityById(
        user.organizationId,
        id,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Service Priority berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateServicePriority(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateServicePriorityRequest;

      const result = await ciaObjectiveService.updateServicePriority(
        user.organizationId,
        id,
        data,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Service Priority berhasil diperbarui',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async deleteServicePriority(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await ciaObjectiveService.deleteServicePriority(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Service Priority berhasil dihapus',
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
