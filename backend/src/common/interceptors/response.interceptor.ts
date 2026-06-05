import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { SuccessResponseType, ExceptionResponseType } from '../types';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponseType<T> | ExceptionResponseType> {
    const defaultResponseMessage = {
      success: 'Successful operation',
      failure: 'Failed operation',
    };

    return next.handle().pipe(
      map((data): SuccessResponseType<T> => {
        if (
          data &&
          (Array.isArray(data) || typeof data === 'object') &&
          'data' in data &&
          'meta' in data
        ) {
          return {
            status: true,
            message: defaultResponseMessage.success,
            data: (data as { data: T; meta: unknown }).data,
            meta: (data as { data: T; meta: unknown }).meta,
          };
        }

        if (!data || typeof data === 'string') {
          return {
            status: true,
            message: defaultResponseMessage.success,
          };
        }

        return {
          status: true,
          message: defaultResponseMessage.success,
          data: data as T,
        };
      }),
    );
  }
}
