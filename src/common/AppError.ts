export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: { field: string; message: string }[];

  /*
    Custom error class for application-specific errors.
    This class extends the built-in Error class and adds additional properties:
    - statusCode: HTTP status code associated with the error.
    - isOperational: Flag indicating if the error is operational (expected) or a programming error.
    - details: Optional array of field-specific error messages, useful for validation errors.
  */

  constructor(
    message: string, 
    statusCode: number, 
    details?: { field: string; message: string }[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    if (details) {
      this.details = details;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}