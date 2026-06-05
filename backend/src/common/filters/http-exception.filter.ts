import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionResponseType } from '../types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const res = exception.getResponse() as { message?: string };

    response.status(exception.getStatus()).json({
      status: false as const,
      message: res.message ?? exception.message,
    } satisfies ExceptionResponseType);
  }
}
