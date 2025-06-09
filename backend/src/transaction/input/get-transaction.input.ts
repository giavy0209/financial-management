import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class GetTransactionInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  moneySourceId?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  fromAmount?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  toAmount?: number;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  fromDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  toDate?: Date;
}
