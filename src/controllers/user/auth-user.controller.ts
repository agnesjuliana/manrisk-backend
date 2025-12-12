import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../../middleware';
import { type RegisterUserRequest, type LoginUserRequest } from '../../models/user';
import { userService } from '../../services/user';

export const userController = {
  async registerUser(request: Request, response: Response, next: NextFunction) {
    try {
      const registerData = request.body as RegisterUserRequest;
      const user = await userService.registerUser(registerData);

      const customResponse = new CustomResponse(
        StatusCodes.CREATED,
        'User berhasil terdaftar',
        user,
      );

      return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async loginUser(request: Request, response: Response, next: NextFunction) {
    try {
      const loginData = request.body as LoginUserRequest;
      const user = await userService.loginUser(loginData.email, loginData.password);

      const customResponse = new CustomResponse(StatusCodes.OK, 'Login berhasil', user);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getUserProfile(request: Request, response: Response, next: NextFunction) {
    try {
      const { userId } = request.params;
      const user = await userService.getUserProfile(userId);

      const customResponse = new CustomResponse(StatusCodes.OK, 'Profil user', user);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async getCurrentUserProfile(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as { id: string };
      const profile = await userService.getUserProfile(user.id);

      const customResponse = new CustomResponse(StatusCodes.OK, 'Profil user', profile);

      return response.status(StatusCodes.OK).json(customResponse.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
