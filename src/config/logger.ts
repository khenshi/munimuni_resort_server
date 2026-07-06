import pino from 'pino';

/*
    Logger configuration for the Express application using Pino.
    This configuration sets the logging level based on the environment variable LOG_LEVEL.
    In development mode, it uses pino-pretty for more readable console output.
    In production, it logs in a structured JSON format suitable for log aggregation systems.
*/

// Check if we are in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Only use pino-pretty in development 
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname', // Keeps the console output clean
      },
    },
  }),
});

export default logger;