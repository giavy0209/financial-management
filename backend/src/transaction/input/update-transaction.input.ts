import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateTransactionInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => Float)
  @IsNumber()
  @IsOptional()
  amount: number;

  @Field(() => String)
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => Int)
  @IsInt()
  @IsOptional()
  categoryId: number;

  @Field(() => Int)
  @IsInt()
  @IsOptional()
  moneySourceId: number;

  @Field(() => Date)
  @IsDate()
  createdAt: Date;
}
