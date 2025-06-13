import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: AppExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext<{ req: AppRequest }>().req.jwtPayload.user;
  },
);
