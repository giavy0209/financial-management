import {
  Injectable,
  NestInterceptor,
  CallHandler,
  Inject,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs';

@Injectable()
export class PaginationMapInterceptor implements NestInterceptor {
  @Inject() reflector: Reflector;
  intercept(
    context: ExecutionContext & {
      contextType: string;
    },
    next: CallHandler,
  ) {
    if (context.contextType === 'graphql') {
      return next.handle().pipe(map((result) => result));
    }

    return next.handle();
  }
}
