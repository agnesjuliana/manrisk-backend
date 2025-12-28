import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import {
  type CreateRiskRegisterRequest,
  type UpdateRiskRegisterRequest,
} from '../../models/risk-register';
import {
  createRiskRegisterService,
  getRiskRegistersService,
  getRiskRegisterByIdService,
  updateRiskRegisterService,
  deleteRiskRegisterService,
} from '../../services/risk-register';

export const riskRegisterController = {
  async createRiskRegister(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateRiskRegisterRequest;

      const result = await createRiskRegisterService(user.organizationId, user.id, data);

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Risk Register berhasil dibuat',
        result,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getRiskRegisters(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string; role: string; departmentId?: string };
      const { page = 1, perPage = 10, status } = request.query;

      const pageNumber = Number.parseInt(page as string, 10) || 1;
      const perPageNumber = Number.parseInt(perPage as string, 10) || 10;

      // Parse status filter - can be single or comma-separated values
      let statusFilter: string[] | undefined;

      if (status) {
        const statusString = status as string;
        statusFilter = statusString.includes(',') ? statusString.split(',').map(s => s.trim()) : [statusString];
      }

      const result = await getRiskRegistersService(
        user.organizationId,
        pageNumber,
        perPageNumber,
        user.role,
        user.departmentId,
        statusFilter,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk Register berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getRiskRegisterById(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await getRiskRegisterByIdService(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk Register berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateRiskRegister(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateRiskRegisterRequest;

      const result = await updateRiskRegisterService(user.organizationId, id, data);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk Register berhasil diperbarui',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async deleteRiskRegister(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await deleteRiskRegisterService(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk Register berhasil dihapus',
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
