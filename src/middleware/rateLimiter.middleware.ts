import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/AppError.js';

// 1. Parse the limit from the environment variable safely
const maxRequests = process.env.RATE_LIMIT_MAX_REQUESTS 
  ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) 
  : 100;

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: maxRequests,         // Limit each IP to X requests per windowMs
  standardHeaders: true,    // Draft-7: Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,     // Disable the `X-RateLimit-*` headers (deprecated)
  
  // 2. The Senior Touch: Intercept the default response and use our global AppError
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(new AppError('Too many requests from this IP, please try again in 15 minutes!', 429));
  },
});