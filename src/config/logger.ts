import pino from 'pino';

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