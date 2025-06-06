import { Catch, HttpException, type ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const type: string = host.getType();

    // GraphQL Context
    if (type === 'graphql') {
      const response = exception.getResponse() as any;
      const message = Array.isArray(response.message)
        ? response.message
        : [response.message];

      const errors = response.errors
        ? Array.isArray(response.errors)
          ? response.errors
          : [response.errors]
        : message;

      return {
        message,
        errors,
        statusCode: exception.getStatus(),
      };
    }
  }
}
