import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse, CustomError } from '../../middleware';
import { organizationService } from '../../services/organization/auth-organization.service';
import { type RegisterOrganizationRequest } from '../../validators/organization';

export const organizationAuthController = {
  async registerOrganization(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; role: string };

      if (!user) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, 'User tidak terautentikasi');
      }

      if (user.role !== 'ADMIN') {
        throw new CustomError(StatusCodes.FORBIDDEN, 'Hanya ADMIN yang bisa mendaftar organisasi');
      }

      const result = await organizationService.registerOrganization(
        user.id,
        request.body as RegisterOrganizationRequest,
      );

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
