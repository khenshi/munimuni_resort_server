import type { Request, Response, NextFunction } from 'express';

/*
    A utility function to wrap asynchronous route handlers in Express.
    This ensures that any errors thrown in the async function are passed to the next middleware (error handler).
    Without this wrapper, unhandled promise rejections could occur, leading to uncaught exceptions.
*/

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};