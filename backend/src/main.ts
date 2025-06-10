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
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
