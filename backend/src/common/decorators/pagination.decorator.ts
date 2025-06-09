import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Args, GqlExecutionContext, Int } from '@nestjs/graphql';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page?: number;

  @Field(() => Int, { defaultValue: 10 })
  pageSize?: number;
}

export const PaginationTest = createParamDecorator(
  async (_: unknown, context: ExecutionContext) => {
    // return { skip, take };
  },
);

export const Pagination = createParamDecorator(
  async (_: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const { page, pageSize } = (ctx.getArgs().pagination ||
      {}) as PaginationInput;

    let skip = 0;
    const take = pageSize || Number.MAX_SAFE_INTEGER;
    if (page && pageSize) {
      skip = (page - 1) * pageSize;
    }
    return { skip, take };
  },
  [
    Args({ name: 'pagination', type: () => PaginationInput, nullable: true }),
    PaginationTest(),
  ],
);
