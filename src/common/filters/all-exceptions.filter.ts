import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

const STATUS_CODE_MAP: Record<number, string> = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE_ENTITY',
  429: 'TOO_MANY_REQUESTS',
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();

    let status: number;
    let code: string;
    let message: string;
    let details: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        const r = response as Record<string, unknown>;
        code =
          typeof r['code'] === 'string'
            ? r['code']
            : (STATUS_CODE_MAP[status] ?? 'HTTP_ERROR');
        message =
          typeof r['message'] === 'string' ? r['message'] : exception.message;
        details = r['details'];
      } else {
        code = STATUS_CODE_MAP[status] ?? 'HTTP_ERROR';
        message = typeof response === 'string' ? response : exception.message;
        details = undefined;
      }
    } else {
      this.logger.error(exception);
      status = 500;
      code = 'INTERNAL_ERROR';
      message = 'Internal server error';
      details = undefined;
    }

    res
      .status(status)
      .json({ success: false, error: { code, message, details } });
  }
}
