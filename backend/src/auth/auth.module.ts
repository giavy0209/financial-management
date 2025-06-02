import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BasePrismaService } from 'src/common/prisma/prisma.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthResolver, AuthService, BasePrismaService],
})
export class AuthModule {}
