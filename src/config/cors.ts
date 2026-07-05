import type { CorsOptions } from 'cors';
import { AppError } from '../common/AppError.js';

// 1. Parse the allowed origins from the environment variable
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : [];

export const corsOptions: CorsOptions = {
  // 2. Use a dynamic function to check the origin
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    // Check if the incoming request's origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // If a rogue website tries to connect, throw our custom AppError!
      callback(new AppError('Not allowed by CORS', 403));
    }
  },
  credentials: true,
  // 3. Explicitly state which methods are allowed (locks down the API)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};