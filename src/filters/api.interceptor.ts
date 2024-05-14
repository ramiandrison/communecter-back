import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from './api.response';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map(data => {
                return {
                    data: typeof (data as any)?.data !== 'undefined' ? (data as any)?.data : data,
                    message: (data as any)?.message ?? 'Successful',
                    success: (data as any)?.success ?? true,
                    statusCode: (data as any)?.statusCode ?? HttpStatus.OK
                }
            }),
            /*catchError(err => throwError(() => ({
                status: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
                message: err.response || 'Unexpected error occurred',
                errors: [err.message],
                success: false,
            })))*/
        );
    }
}