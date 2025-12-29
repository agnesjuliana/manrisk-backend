import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { getDashboardStatisticsService } from '../../services/statistics';

export const statisticsController = {
  async getStatistics(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as { id: string; organizationId: string };

      const result = await getDashboardStatisticsService(user.organizationId);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Statistik dashboard berhasil diambil',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
