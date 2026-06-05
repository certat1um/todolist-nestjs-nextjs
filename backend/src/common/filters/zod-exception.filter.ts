import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ExceptionResponseType } from '../types';

@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const res = exception.getResponse() as {
      message?: string;
      errors?: unknown[];
    };

    response.status(exception.getStatus()).json({
      status: false as const,
      message: res.message ?? 'Validation failed',
      errors: res.errors,
    } satisfies ExceptionResponseType);
  }
}
