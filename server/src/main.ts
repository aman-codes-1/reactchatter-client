import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "https://nest-react-chat-app-server.vercel.app/",
      "https://nest-react-chat-app.vercel.app/",
      "http://localhost:3000",
      "http://localhost:8000",
      "http://localhost:8080",
      "http://localhost:4200",
    ],
  });
  await app.listen(8000);
}
bootstrap();
