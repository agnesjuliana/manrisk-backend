import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { getRiskSourcesService } from '../../services/risk-register/risk-source.service';

export const riskSourceController = {
  async getRiskSources(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { organizationId: string };
      const { search } = request.query;

      const searchString = (search as string) || undefined;

      const result = await getRiskSourcesService(user.organizationId, searchString);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk Sources berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
