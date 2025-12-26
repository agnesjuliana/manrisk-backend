import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { type UpsertOrganizationRequest } from '../../models/organization';
import { organizationService } from '../../services/organization';

export const organizationController = {
  async upsertOrganization(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string };
      const data = request.body as UpsertOrganizationRequest;

      const result = await organizationService.upsertOrganization(user.id, data);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Organisasi berhasil disimpan',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
