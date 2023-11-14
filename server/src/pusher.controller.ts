import { Body, Controller, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { PusherService } from "./pusher.service";

@Controller("api")
export class PusherController {
  constructor(
    private readonly appService: AppService,
    private pusherService: PusherService
  ) {}

  @Post("messages")
  async messages(
    @Body("username") username: string,
    @Body("message") message: string
  ) {
    await this.pusherService.trigger("chat", "message", {
      username,
      message,
    });
    return [];
  }
}
