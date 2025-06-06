import {
  Injectable,
  NestInterceptor,
  CallHandler,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { map } from 'rxjs';
import { IS_GET_LIST } from '../decorators/metadata.decorator';

@Injectable()
export class PaginationMapInterceptor implements NestInterceptor {
  @Inject() reflector: Reflector;
  intercept(context: AppExecutionContext, next: CallHandler) {
    if (context.contextType === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      const { page, pageSize } = (ctx.getArgs().pagination || {}) as {
        page: number;
        pageSize: number;
      };
      const isList = this.reflector.getAllAndOverride<boolean>(IS_GET_LIST, [
        context.getHandler(),
        context.getClass(),
      ]);

      return next.handle().pipe(
        map((result) => {
          const message = result.message
            ? Array.isArray(result.message)
              ? result.message
              : [result.message]
            : 'Execute Successfully';
          if (isList) {
            return {
              data: result.data,
              pagination: {
                total: result.total,
                page: page || 1,
                pageSize: pageSize || Number.MAX_SAFE_INTEGER,
              },
              message,
              statusCode: HttpStatus.OK,
            };
          }
          return {
            data: result.data,
            message,
            statusCode: HttpStatus.OK,
          };
        }),
      );
    }

    return next.handle();
  }
}
