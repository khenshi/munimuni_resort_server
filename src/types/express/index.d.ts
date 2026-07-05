import type { Logger } from 'pino';

declare global {
  namespace Express {
    export interface Request {
      log: Logger;
    }
  }
}