import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { Request, RequestSchema } from "./request.schema";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PusherController } from "./pusher.controller";
import { PusherService } from "./pusher.service";
import { RequestController } from "./request.controller";
import { RequestService } from "./request.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: "users" },
    ]),
    MongooseModule.forFeature([
      { name: Request.name, schema: RequestSchema, collection: "requests" },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    PusherController,
    RequestController,
  ],
  providers: [AppService, AuthService, PusherService, RequestService],
})
export class AppModule {}
