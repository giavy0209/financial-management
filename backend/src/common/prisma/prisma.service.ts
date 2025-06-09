/* eslint-disable @typescript-eslint/unbound-method */
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class BasePrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  findFirstOrThrow<T, A extends Prisma.Args<T, 'findFirst'>>(
    this: T,
    args: A,
    {
      throwCase,
      message,
    }: {
      throwCase: 'IF_NOT_EXISTS';
      message?: string;
    },
  ): Promise<NonNullable<Prisma.Result<T, A, 'findFirst'>>>;
  async findFirstOrThrow<T, A extends Prisma.Args<T, 'findFirst'>>(
    this: T,
    args: A,
    {
      throwCase,
      message,
    }: {
      throwCase?: 'IF_EXISTS' | 'IF_NOT_EXISTS';
      message?: string;
    } = {},
  ): Promise<Prisma.Result<T, A, 'findFirst'>> {
    const context = Prisma.getExtensionContext(this) as any;
    const data = await context.findFirst(args);
    if (throwCase) {
      switch (throwCase) {
        case 'IF_EXISTS':
          if (data)
            throw new BadRequestException(
              message ||
                `${context.$name} with query ${JSON.stringify(args.where)} is existed`,
            );
          break;
        case 'IF_NOT_EXISTS':
          if (!data)
            throw new BadRequestException(
              message ||
                `${context.$name} with query ${JSON.stringify(args.where)} is not existed`,
            );
          break;
        default:
          break;
      }
    }
    return data;
  }

  findFirstAndUpdate<T, A extends Prisma.Args<T, 'findFirst'>>(
    this: T,
    args: A,
    updateData: Prisma.Args<T, 'update'>['data'],
    {
      isThrow,
      message,
    }: {
      isThrow: true;
      message?: string;
    },
  ): Promise<Prisma.Result<T, A, 'update'>>;
  async findFirstAndUpdate<T, A extends Prisma.Args<T, 'findFirst'>>(
    this: T,
    args: A,
    updateData: Prisma.Args<T, 'update'>['data'],
    {
      isThrow,
      message,
    }: {
      isThrow?: boolean;
      message?: string;
    } = {},
  ): Promise<Prisma.Result<T, A, 'update'> | null> {
    const context = Prisma.getExtensionContext(this) as any;
    const data = await context.findFirst({
      where: args.where,
    });
    if (isThrow && !data) {
      throw new BadRequestException(
        message ||
          `${context.$name} with query ${JSON.stringify(args.where)} is existed`,
      );
    }
    if (data) {
      return context.update({
        ...args,
        where: { id: data.id },
        data: updateData,
      });
    }
    return null;
  }

  async exists<T>(
    this: T,
    where: Prisma.Args<T, 'findFirst'>['where'],
    {
      throwCase,
      message,
    }: {
      throwCase?: 'IF_EXISTS' | 'IF_NOT_EXISTS';
      message?: string;
    } = {},
  ) {
    const context = Prisma.getExtensionContext(this) as any;

    const data = await context.findFirst({ where, select: { id: 1 } });
    if (throwCase) {
      switch (throwCase) {
        case 'IF_EXISTS':
          if (data)
            throw new BadRequestException(
              message ||
                `${context.$name} with query ${JSON.stringify(where)} is existed`,
            );
          break;
        case 'IF_NOT_EXISTS':
          if (!data)
            throw new BadRequestException(
              message ||
                `${context.$name} with query ${JSON.stringify(where)} is not existed`,
            );
          break;
        default:
          break;
      }
    }
    return !!data;
  }

  async findAndPagination<T, A extends Prisma.Args<T, 'findMany'>>(
    this: T,
    args: A,
  ): Promise<{
    data: Prisma.Result<T, A, 'findMany'>;
    total: number;
  }> {
    const context = Prisma.getExtensionContext(this) as any;
    const [data, total] = await Promise.all([
      context.findMany(args),
      context.count({ where: args.where }),
    ]);

    return { data, total };
  }

  withExtensions() {
    return this.$extends({
      model: {
        $allModels: {
          findAndPagination: this.findAndPagination,
          exists: this.exists,
          findFirstOrThrow: this.findFirstOrThrow,
          findFirstAndUpdate: this.findFirstAndUpdate,
        },
      },
    });
  }
}
