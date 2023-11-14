import { Module } from "@nestjs/common";
// import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PusherController } from "./pusher.controller";
import { PusherService } from "./pusher.service";
import 'dotenv/config';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: ".env",
    // }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController, AuthController, PusherController],
  providers: [AppService, AuthService, PusherService],
})
export class AppModule {}
