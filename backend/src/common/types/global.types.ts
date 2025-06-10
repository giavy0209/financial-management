/* eslint-disable no-var */
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { BasePrismaService } from '../../common/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
config({
  path: fs.existsSync(path.join(process.cwd(), '.env'))
    ? path.join(process.cwd(), '.env')
    : path.join(process.cwd(), '.env.example'),
});

const envConfig = {
  JWT_SECRET: process.env.JWT_SECRET || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  PORT: process.env.PORT || 3000,
};
declare global {
  var Config: {
    [k in keyof typeof envConfig]: (typeof envConfig)[k];
  };
  interface Pagination {
    skip: undefined | number;
    take: undefined | number;
  }

  type ResolverReturnedType<T = any> = Promise<{
    data: T;
    message?: string;
    total?: number;
  }>;

  type AppExecutionContext = ExecutionContext & {
    contextType: 'graphql' | 'http';
  };

  type JwtPayload = {
    user: {
      id: number;
    };
  };

  type AppRequest = Request & {
    jwt: string;
    jwtPayload: JwtPayload;
  };

  type PrismaService = ReturnType<BasePrismaService['withExtensions']>;
}
global.Config = envConfig;

export {};
