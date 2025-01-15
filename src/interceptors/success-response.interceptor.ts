import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        const { responseMetadata, ...restData } = data || {};

        return {
          error: false,
          success: true,
          message:
            responseMetadata?.message || 'Request processed successfully',
          data: restData._doc || restData,
          statusCode: statusCode,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
