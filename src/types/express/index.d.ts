import type { Logger } from 'pino';

/*
    Extending the Express Request interface to include a 'log' property.
    This allows us to attach a Pino logger instance to each request, enabling structured logging throughout the application.
    By doing this, we can log request-specific information (like request ID, user ID, etc.) in a consistent manner.
*/

declare global {
  namespace Express {
    export interface Request {
      log: Logger;
    }
  }
}