import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import {
  type CreateRiskApprovalRequest,
  type UpdateRiskApprovalRequest,
} from '../../models/risk-approval';
import {
  createRiskApprovalService,
  getRiskApprovalsService,
  getRiskApprovalByIdService,
  updateRiskApprovalService,
  deleteRiskApprovalService,
} from '../../services/risk-approval';

export const riskApprovalController = {
  async createRiskApproval(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateRiskApprovalRequest;

      const result = await createRiskApprovalService(user.organizationId, user.id, data);

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Risk approval berhasil dibuat',
        result,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getRiskApprovals(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { page = 1, perPage = 10 } = request.query;

      const pageNumber = Number.parseInt(page as string, 10) || 1;
      const perPageNumber = Number.parseInt(perPage as string, 10) || 10;

      const result = await getRiskApprovalsService(user.organizationId, pageNumber, perPageNumber);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk approval berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getRiskApprovalById(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await getRiskApprovalByIdService(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk approval berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateRiskApproval(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateRiskApprovalRequest;

      const result = await updateRiskApprovalService(user.organizationId, id, data);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk approval berhasil diperbarui',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async deleteRiskApproval(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await deleteRiskApprovalService(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk approval berhasil dihapus',
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
