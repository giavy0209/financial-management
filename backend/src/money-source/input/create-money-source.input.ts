import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateMoneySourceInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Number)
  value: number;
}
