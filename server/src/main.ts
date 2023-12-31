import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
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
  await app.register(fastifyCookie as any, {
    secret: '', // for cookies signature
  });
  await app.listen(8000);
}
bootstrap();
