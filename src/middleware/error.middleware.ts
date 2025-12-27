import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ErrorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  let errorStatus = StatusCodes.INTERNAL_SERVER_ERROR;
  let errorMessage = error.message || 'Internal server error';

  // Handle Prisma errors
  if (error.code?.startsWith('P')) {
    // P2002 = Unique constraint failed
    if (error.code === 'P2002') {
      errorStatus = StatusCodes.BAD_REQUEST;
      errorMessage = `Duplicate entry: ${error.meta?.target?.join(', ')} already exists`;
    }
    // P2003 = Foreign key constraint failed
    else if (error.code === 'P2003') {
      errorStatus = StatusCodes.BAD_REQUEST;
      errorMessage = 'Invalid reference: Related record not found';
    }
    // P2025 = Record not found
    else if (error.code === 'P2025') {
      errorStatus = StatusCodes.NOT_FOUND;
      errorMessage = 'Record not found';
    }
    // Default Prisma error
    else {
      errorStatus = StatusCodes.BAD_REQUEST;
      errorMessage = error.message || 'Database error occurred';
    }
  }
  // Handle custom numeric status codes
  else if (typeof error.code === 'number') {
    errorStatus = error.code;
  }

  response.status(errorStatus).json({
    status: false,
    code: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === 'development' ? error.stack : {},
  });

  next();
};

export class CustomError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
  }
}
