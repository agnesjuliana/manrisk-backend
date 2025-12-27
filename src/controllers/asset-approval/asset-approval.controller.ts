import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import {
  type CreateAssetApprovalRequest,
  type UpdateAssetApprovalRequest,
} from '../../models/asset-approval';
import {
  createAssetApprovalService,
  getAssetApprovalsService,
  getAssetApprovalByIdService,
  updateAssetApprovalService,
  deleteAssetApprovalService,
} from '../../services/asset-approval';

export const assetApprovalController = {
  async createAssetApproval(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateAssetApprovalRequest;

      const result = await createAssetApprovalService(user.organizationId, user.id, data);

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Asset approval berhasil dibuat',
        result,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getAssetApprovals(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { page = 1, perPage = 10 } = request.query;

      const pageNumber = Number.parseInt(page as string, 10) || 1;
      const perPageNumber = Number.parseInt(perPage as string, 10) || 10;

      const result = await getAssetApprovalsService(user.organizationId, pageNumber, perPageNumber);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Asset approval berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getAssetApprovalById(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await getAssetApprovalByIdService(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Asset approval berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateAssetApproval(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateAssetApprovalRequest;

      const result = await updateAssetApprovalService(user.organizationId, id, data);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Asset approval berhasil diperbarui',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async deleteAssetApproval(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await deleteAssetApprovalService(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Asset approval berhasil dihapus',
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
