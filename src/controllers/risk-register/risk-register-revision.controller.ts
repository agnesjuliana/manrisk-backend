import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import {
  type CreateRiskRegisterRevisionRequest,
  type UpdateRiskRegisterRevisionRequest,
} from '../../models/risk-register';
import {
  createRiskRegisterRevisionService,
  getRiskRevisionsByOrganizationService,
  getRiskRevisionByIdService,
  updateRiskRegisterRevisionService,
  deleteRiskRegisterRevisionService,
} from '../../services/risk-register/risk-register-revision.service';

export const riskRegisterRevisionController = {
  async createRiskRegisterRevision(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateRiskRegisterRevisionRequest;

      const result = await createRiskRegisterRevisionService(user.organizationId, data);

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Risk Revision berhasil dibuat',
        result,
      );

      response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getRiskRevisions(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { page = 1, perPage = 10, search } = request.query;

      const pageNumber = Number.parseInt(page as string, 10) || 1;
      const perPageNumber = Number.parseInt(perPage as string, 10) || 10;
      const searchQuery = search as string | undefined;

      const result = await getRiskRevisionsByOrganizationService(
        user.organizationId,
        pageNumber,
        perPageNumber,
        searchQuery,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk Revisions berhasil diambil',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getRiskRevisionById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await getRiskRevisionByIdService(user.organizationId, id);

      if (!result) {
        const customResponse = new CustomResponse(
          StatusCodes.NOT_FOUND,
          'Risk Revision tidak ditemukan',
          null,
        );

        response.status(StatusCodes.NOT_FOUND).json(customResponse.toJSON());

        return;
      }

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Detail Risk Revision berhasil diambil',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async updateRiskRegisterRevision(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateRiskRegisterRevisionRequest;

      const result = await updateRiskRegisterRevisionService(user.organizationId, id, data);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk Revision berhasil diubah',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async deleteRiskRegisterRevision(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await deleteRiskRegisterRevisionService(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk Revision berhasil dihapus',
        null,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
