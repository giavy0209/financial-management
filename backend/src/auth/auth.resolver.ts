import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse, LoginInput, SignupInput, User } from './auth.types';
import { JwtAuthGuard } from './jwt.guard';
import { CurrentUser } from './current-user.decorator';
import { QuerySingle } from 'src/common/decorators/resolvers.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async signup(@Args('input') input: SignupInput) {
    return this.authService.signup(input.email, input.password, input.name);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input.email, input.password);
  }

  @QuerySingle(User)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: { userId: number }) {
    return this.authService.getCurrentUser(user.userId);
  }
}
