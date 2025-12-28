import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { getRiskCategoriesService } from '../../services/risk-register/risk-category.service';

export const riskCategoryController = {
  async getRiskCategories(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { organizationId: string };
      const { search } = request.query;

      const searchString = (search as string) || undefined;

      const result = await getRiskCategoriesService(user.organizationId, searchString);

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Risk Categories berhasil diambil',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
