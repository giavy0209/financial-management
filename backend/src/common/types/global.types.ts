import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { BasePrismaService } from 'src/common/prisma/prisma.service';

// TODO add global types here
declare global {
  interface Pagination {
    skip: undefined | number;
    take: undefined | number;
    orderBy:
      | {
          [key: string]: 'asc' | 'desc';
        }
      | undefined;
  }

  type ResolverReturnedType<T = any> = Promise<{
    data: T;
    message?: string;
    total?: number;
  }>;

  type AppExecutionContext = ExecutionContext & {
    contextType: string;
  };

  type AppRequest = Request & {
    jwt: string;
  };

  type PrismaService = ReturnType<BasePrismaService['withExtensions']>;
}
export {};
