import { Module } from '@nestjs/common';
import { MoneySourceService } from './money-source.service';
import { MoneySourceResolver } from './money-source.resolver';

@Module({
  providers: [MoneySourceResolver, MoneySourceService],
})
export class MoneySourceModule {}
