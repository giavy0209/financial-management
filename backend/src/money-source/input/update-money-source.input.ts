import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class UpdateMoneySourceInput {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  id: number;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;
}
