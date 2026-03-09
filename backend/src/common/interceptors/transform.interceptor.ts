import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success:    boolean;
  data:       T;
  message:    string;
  meta?:      object;
  timestamp:  string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((payload) => {
        // If payload already has { data, meta } shape (paginated), spread it
        if (payload && typeof payload === 'object' && !Array.isArray(payload) && 'data' in payload && 'meta' in payload) {
          return {
            success:   true,
            data:      payload.data,
            meta:      payload.meta,
            message:   payload.message ?? 'OK',
            timestamp: new Date().toISOString(),
          };
        }
        // Wrap arrays and other payloads
        return {
          success:   true,
          data:      payload,
          message:   'OK',
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
