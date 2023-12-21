import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "https://reactchatter-server.vercel.app",
      "https://reactchatter.vercel.app",
      "http://localhost:3001",
      "http://localhost:8000",
      "http://localhost:8080",
      "http://localhost:4200",
    ],
    allowedHeaders:
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe",
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(8000);
}
bootstrap();
