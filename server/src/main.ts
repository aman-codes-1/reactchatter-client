import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://nest-react-chat-app-cfm4.vercel.app', 'http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
  })
  await app.listen(8000);
}
bootstrap();
