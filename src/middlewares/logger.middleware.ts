import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    res.on('finish', () => {
      const logger = new Logger('requests');
      const { method, url, ip } = req;
      const { statusCode } = res;
      const duration = Date.now() - start;

      if (statusCode >= 400 && statusCode < 500) {
        logger.warn(`[${method}] ${url} {${statusCode}} ${duration}ms [${ip}]`);
      } else if (statusCode >= 500) {
        logger.error(`[${method}] ${url} {${statusCode}} ${duration}ms [${ip}]`);
      } else {
        logger.log(`[${method}] ${url} {${statusCode}} ${duration}ms [${ip}]`);
      }
    });
    next();
  }
}
