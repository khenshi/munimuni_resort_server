import type { Request, Response, NextFunction } from 'express';
import { type ZodTypeAny, ZodError } from 'zod';
import { AppError } from '../common/AppError.js'; // Note: Ensure the .js extension is required by your tsconfig moduleResolution
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

type ValidatedRequestData = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};

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

      // 👇 THE FIX: Overwrite the Express getter cleanly while keeping your ParsedQs type
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