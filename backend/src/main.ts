import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './common/types/global.types';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // Enable CORS for all origins
  app.enableCors({
    origin: '*', // Allow requests from any domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['*'],
  });

  await app.listen(Config.PORT ?? 3001);
}
bootstrap();
