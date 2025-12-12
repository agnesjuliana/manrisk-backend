import { type Request, type Response, type NextFunction } from 'express';
import type Joi from 'joi';
import { type ZodSchema, ZodError } from 'zod';

import { CustomError } from './error.middleware';

/**
 * Middleware untuk validasi request body dengan Joi schema
 * Usage: router.post('/path', validate(myJoiSchema), handler)
 */
export const validate =
  (schema: Joi.Schema) => (request: Request, response: Response, next: NextFunction) => {
    const { error }: { error: Joi.ValidationError | undefined } = schema.validate(request.body, {
      abortEarly: false,
    });
    const isValid = error == null;

    if (isValid) {
      next();
    } else if (error) {
      const { details } = error;
      const message = details.map((index) => index.message).join(',');

      return next(new CustomError(422, message));
    } else {
      return next(new CustomError(422, 'Validation error'));
    }
  };

/**
 * Middleware untuk validasi request body dengan Zod schema
 * Usage: router.post('/path', validateZod(myZodSchema), handler)
 */
export const validateZod =
  (schema: ZodSchema) => (request: Request, response: Response, next: NextFunction) => {
    try {
      schema.parse(request.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');

        return next(new CustomError(422, messages));
      }

      return next(error);
    }
  };
