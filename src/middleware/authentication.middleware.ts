import { type Role } from '@prisma/client';
import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import passport from '../strategy/jwt-strategy';
import { CustomError } from './error.middleware';

export interface IRequestUser extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    is_email_verified: boolean;
    created_at: Date;
    updated_at: Date;
  };
}

/**
 * Middleware to validate JWT token and check if user exists
 * Combines passport JWT authentication with user verification
 * Usage: router.get('/protected', authenticate, controller.action)
 */
export const authenticate = (request: Request, response: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (error: any, user: any) => {
    if (error) {
      next(new CustomError(StatusCodes.UNAUTHORIZED, 'Token tidak valid'));

      return;
    }

    if (!user || !user.id) {
      next(
        new CustomError(StatusCodes.UNAUTHORIZED, 'User tidak ditemukan. Silakan login kembali.'),
      );

      return;
    }

    request.user = user;
    next();
  })(request, response, next);
};

/**
 * Middleware factory to check if user has one of the allowed roles
 * Usage: router.post('/admin-only', authenticate, hasAccess(['ADMIN']), controller.action)
 * Usage: router.post('/manager-route', authenticate, hasAccess(['ADMIN', 'RISK_MANAGER']), controller.action)
 */
export const hasAccess =
  (allowedRoles: Role[]) =>
  (request: Request, response: Response, next: NextFunction): void => {
    const userRole = (request.user as any)?.role;

    if (!userRole) {
      next(new CustomError(StatusCodes.UNAUTHORIZED, 'User role tidak ditemukan'));

      return;
    }

    if (!allowedRoles.includes(userRole)) {
      next(
        new CustomError(
          StatusCodes.FORBIDDEN,
          `Akses ditolak. Role yang diizinkan: ${allowedRoles.join(', ')}`,
        ),
      );

      return;
    }

    next();
  };

/**
 * Legacy: kept for backward compatibility
 */
export const isAllowedRoles = hasAccess;
