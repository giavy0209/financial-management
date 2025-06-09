import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectDatabase } from 'src/common/decorators/inject-database.decorator';
@Injectable()
export class AuthService {
  @InjectDatabase() private prisma: PrismaService;
  @Inject() jwtService: JwtService;

  async signup(email: string, password: string, name?: string) {
    await this.prisma.user.exists(
      { email },
      {
        throwCase: 'IF_EXISTS',
        message: 'Email already exists',
      },
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return { success: true };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign(
      { user: { id: user.id } },
      { secret: process.env.JWT_SECRET },
    );
    return { token, user: { ...user, password: undefined } };
  }

  async getCurrentUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { ...user, password: undefined };
  }
}
