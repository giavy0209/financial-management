import { HttpStatus, Module } from '@nestjs/common';
import { GraphQLModule, registerEnumType } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import GraphQLJSON from 'graphql-type-json';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/interceptors/exception.interceptor';
import { PaginationMapInterceptor } from './common/interceptors/response.interceptor';
import { JwtAuthGuard } from './common/guard/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
registerEnumType(HttpStatus, { name: 'HttpCode' });
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      resolvers: { JSON: GraphQLJSON },
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    PrismaModule,
    CategoryModule,
    TransactionModule,
  ],
  providers: [
    JwtService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PaginationMapInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
