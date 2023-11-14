import { Body, Controller, Post } from "@nestjs/common";

@Controller("auth")
export class AuthController {
  constructor() {}

  @Post("login")
  async messages(
    @Body("username") username: string,
    @Body("message") message: string
  ) {
    // await this.pusherService.trigger('chat', 'message', {
    //   username,
    //   message,
    // });
    return [];
  }
}
