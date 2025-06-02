import { Global, Module } from '@nestjs/common';
import { BasePrismaService } from './prisma.service';
import { DATABASE_TOKEN } from 'src/common/decorators/inject-database.decorator';

const PROVIDE_DATABASE = {
  provide: DATABASE_TOKEN,
  useFactory() {
    return new BasePrismaService().withExtensions();
  },
};
@Global()
@Module({
  imports: [],
  providers: [PROVIDE_DATABASE],
  exports: [PROVIDE_DATABASE],
})
export class PrismaModule {}
