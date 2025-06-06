import { Resolver, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Login, Signup, User } from './auth.types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  AppMutation,
  QuerySingle,
} from 'src/common/decorators/resolvers.decorator';
import { SignupInput } from './input/signup.input';
import { LoginInput } from './input/login.input';
import { IsPublic } from 'src/common/decorators/metadata.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @AppMutation(Signup)
  @IsPublic()
  async signup(@Args('input') input: SignupInput) {
    const data = await this.authService.signup(
      input.email,
      input.password,
      input.name,
    );
    return {
      data,
      message: 'User created successfully',
    };
  }

  @AppMutation(Login)
  @IsPublic()
  async login(@Args('input') input: LoginInput) {
    const data = await this.authService.login(input.email, input.password);
    return {
      data,
      message: 'Login successfully',
    };
  }

  @QuerySingle(User)
  async me(@CurrentUser() user: JwtPayload['user']) {
    const data = await this.authService.getCurrentUser(user.id);
    return {
      data,
      message: 'User fetched successfully',
    };
  }
}
