import type { CorsOptions } from 'cors';
import { AppError } from '../common/AppError.js';

/*
    CORS Configuration for the Express application.
    This configuration allows requests from specific origins defined in the environment variable CORS_ORIGIN.
    It also allows credentials (like cookies) to be sent with requests.
    The allowed methods and headers are explicitly defined for security reasons.
*/

// Parse the allowed origins from the environment variable
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : [];

export const corsOptions: CorsOptions = {
  // dynamic function to check the origin
  origin: (origin, callback) => {
    // Allow requests with no origin 
    if (!origin) return callback(null, true);

    // Check if the incoming request's origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      //throw our custom AppError if the origin is not allowed
      callback(new AppError('Not allowed by CORS', 403));
    }
  },
  credentials: true,
  // Explicitly state which methods are allowed
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};