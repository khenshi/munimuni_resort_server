import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/AppError.js';

// Express recognizes error middleware by these exactly 4 arguments
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // If it's our custom AppError, extract the specific code and message
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Log the error using Pino (attached to req by pino-http)
  if (req.log) {
    req.log.error({ err, statusCode }, message);
  } else {
    console.error(err); // Fallback just in case
  }

  // Send the standardized JSON response
  // ... previous code (logging, checking if AppError, etc.)

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // 👈 Only include details if they actually exist
    ...(err instanceof AppError && err.details ? { errors: err.details } : {}), 
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};