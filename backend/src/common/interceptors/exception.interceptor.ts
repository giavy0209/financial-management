import { Catch, HttpException, HttpStatus, type ArgumentsHost } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const type: string = host.getType();

    // GraphQL Context
    if (type === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      const gqlContext = gqlHost.getContext();

      const response = exception.getResponse() as any;
      const message = response.message;
      const errors: any = response.errors || [message]; //ensure errors is always an array.

      return {
        message: message,
        errors: [
          {
            message: message,
            extensions: {
              code: exception.getStatus() || 500,
              errors: errors,
            },
          },
        ],
      };
    }

    // Default HTTP Context
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const statusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const response = exception.getResponse() as any;
    const message = response.message;
    const errors: any = response.errors || [];

    res.status(statusCode).json({
      message,
      errors: errors || message,
    });
  }
}
