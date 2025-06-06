import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/common/decorators/metadata.decorator';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: AppExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const contextType = context.contextType;
    let req: AppRequest;

    if (contextType === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      req = ctx.getContext<{ req: AppRequest }>().req as AppRequest;
    } else {
      req = context.switchToHttp().getRequest<AppRequest>();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid token type');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: global.Config.JWT_SECRET,
      });
      console.log(payload);

      req.jwtPayload = payload;
      req.jwt = token;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
