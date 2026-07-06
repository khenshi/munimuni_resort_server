import type { Request, Response, NextFunction } from 'express';
import { type ZodTypeAny, ZodError } from 'zod';
import { AppError } from '../common/AppError.js'; // Note: Ensure the .js extension is required by your tsconfig moduleResolution
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

/*
    Middleware for validating incoming requests using Zod schemas.
    This middleware takes a Zod schema and validates the request's body, query, and params against it.
    If validation fails, it throws an AppError with details about the validation issues.
    If validation succeeds, it overwrites the request's body, query, and params with the validated data.
*/

// Define a type for the validated request data
type ValidatedRequestData = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};

// The validate middleware function takes a Zod schema and returns an Express middleware function
export const validate = <T extends ZodTypeAny>(schema: T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as ValidatedRequestData;

      if (validatedData.body !== undefined) {
        req.body = validatedData.body;
      }

      // Overwrite the Express getter cleanly while keeping your ParsedQs type
      if (validatedData.query !== undefined) {
        Object.defineProperty(req, 'query', {
          value: validatedData.query as ParsedQs,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
      
      if (validatedData.params !== undefined) {
        req.params = validatedData.params as ParamsDictionary;
      }

      next();

    // Catch any validation errors and pass them to the global error handler
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((issue) => ({
          // Added .replace('query.', '') so query param errors format cleanly too!
          field: issue.path.join('.').replace('body.', '').replace('params.', '').replace('query.', ''),
          message: issue.message,
        }));

        next(new AppError('Validation failed', 400, errorDetails));
      } else {
        next(error);
      }
    }
  };
};