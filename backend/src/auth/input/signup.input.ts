import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;
}
