import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import {
  type CreateRiskCriteriaRequest,
} from '../../models/organization/risk-criteria.model';
import { riskCriteriaService } from '../../services/organization/risk-criteria.service';

export const riskCriteriaController = {
  async createRiskCriteria(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateRiskCriteriaRequest;

      const result = await riskCriteriaService.upsertRiskCriteria(
        user.organizationId,
        data,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Kriteria Risiko berhasil disimpan',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async upsertRiskCriteria(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string; organizationId: string };
      const data = request.body as CreateRiskCriteriaRequest;

      const result = await riskCriteriaService.upsertRiskCriteria(
        user.organizationId,
        data,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'Kriteria Risiko berhasil disimpan',
        result,
      );

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
