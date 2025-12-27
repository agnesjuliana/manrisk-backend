import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { getAssetTypesService } from '../../services/asset';

export const assetTypeController = {
  async getAssetTypes(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };

      const result = await getAssetTypesService(user.organizationId);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Asset Types berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
