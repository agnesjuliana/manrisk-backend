import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { type UpsertScaleStatusRequest } from '../../models/organization/scale-status.model';
import { scaleStatusService } from '../../services/organization/scale-status.service';

export const scaleStatusController = {
  async upsertScaleStatus(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as UpsertScaleStatusRequest;

      const result = await scaleStatusService.upsertScaleStatus(user.organizationId, data);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Scale Status berhasil disimpan',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
