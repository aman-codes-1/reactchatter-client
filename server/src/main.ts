import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.ALLOWED_CLIENTS
      ? (process.env.ALLOWED_CLIENTS?.includes(',') &&
          process.env.ALLOWED_CLIENTS?.split(',')) ||
        process.env.ALLOWED_CLIENTS
      : process.env.CLIENT_URI,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(8000);
}
bootstrap();
