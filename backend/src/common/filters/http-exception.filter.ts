// http-exception.filter.ts
import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx      = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request  = ctx.getRequest<Request>();
    const status   = exception.getStatus();
    const exRes    = exception.getResponse();

    const message =
      typeof exRes === 'object' && 'message' in exRes
        ? (exRes as any).message
        : exception.message;

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} — ${status}`, exception.stack);
    }

    response.status(status).json({
      success:    false,
      statusCode: status,
      message:    Array.isArray(message) ? message[0] : message,
      errors:     Array.isArray(message) ? message : undefined,
      path:       request.url,
      timestamp:  new Date().toISOString(),
    });
  }
}
