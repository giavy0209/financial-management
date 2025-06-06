import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateTransactionInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  categoryId?: number;
}
