import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { getUserTasksService } from '../../services/task';

export const taskController = {
  async getUserTasks(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user as {
        id: string;
        organizationId: string;
        role?: string;
        departmentId?: string;
      };

      const result = await getUserTasksService(
        user.organizationId,
        user.id,
        user.role || 'ADMIN',
        user.departmentId,
      );

      const customResponse = new CustomResponse(
        StatusCodes.OK,
        'User tasks berhasil diambil',
        result,
      );

      response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
