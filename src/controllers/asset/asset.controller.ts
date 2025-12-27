import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { type CreateAssetRequest, type UpdateAssetRequest } from '../../models/asset';
import {
  createAssetService,
  getAssetsService,
  getAssetByIdService,
  updateAssetService,
  deleteAssetService,
} from '../../services/asset';

export const assetController = {
  async createAsset(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateAssetRequest;

      const result = await createAssetService(user.organizationId, user.id, data);

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'Asset berhasil dibuat',
        result,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getAssets(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { page = 1, perPage = 10 } = request.query;

      const pageNumber = Number.parseInt(page as string, 10) || 1;
      const perPageNumber = Number.parseInt(perPage as string, 10) || 10;

      const result = await getAssetsService(user.organizationId, pageNumber, perPageNumber);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Assets berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getAssetById(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      const result = await getAssetByIdService(user.organizationId, id);

      if (!result) {
        const customResponse = new CustomResponse(
          StatusCodes.NOT_FOUND,
          'Asset tidak ditemukan',
          null,
        );

        return response.status(StatusCodes.NOT_FOUND).json(customResponse.toJSON());
      }

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Asset berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async updateAsset(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;
      const data = request.body as UpdateAssetRequest;

      const result = await updateAssetService(user.organizationId, id, data);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Asset berhasil diperbarui',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async deleteAsset(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const { id } = request.params;

      await deleteAssetService(user.organizationId, id);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Asset berhasil dihapus',
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
