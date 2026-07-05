import express from 'express';
// errors
import * as pinoHttpModule from 'pino-http';
import logger from './config/logger.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { AppError } from './common/AppError.js';
//routes
import packageRoutes from './routes/v1/package.routes.js';
//cors
import cors from 'cors';
import { corsOptions } from './config/cors.js';
// rate limiter
import { apiLimiter } from './middleware/rateLimiter.middleware.js';
import cookieParser from 'cookie-parser';

const pinoHttp = (pinoHttpModule as any).default || pinoHttpModule;

const app = express();

app.set('trust proxy', 1); 


// Tells Express how to stringify custom data types
app.set('json replacer', (key: string, value: any) =>
  typeof value === 'bigint' ? value.toString() : value
);

// Body parsers and Pino Logger
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp({ logger })); // Automatically logs every request

app.use('/api', apiLimiter); 

// API Routes
app.use('/api/v1/packages', packageRoutes);

// If a route isn't found, throw a 404 AppError
app.all(/(.*)/, (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
});

// Global Error Handler MUST be the last app.use()
app.use(errorMiddleware);

export default app;