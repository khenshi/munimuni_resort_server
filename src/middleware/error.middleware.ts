import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/AppError.js';

/*
    Global error handling middleware for the Express application.
    This middleware captures any errors thrown in the application, logs them, and sends a standardized JSON response to the client.
    It differentiates between operational errors (like validation errors) and programming errors (like bugs), ensuring that sensitive information is not exposed in production.
*/

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
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(err instanceof AppError && err.details ? { errors: err.details } : {}), 
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};