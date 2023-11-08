import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService, PusherService } from './app.service'

@Controller('')
export class AppController {
  constructor(
    private readonly appService : AppService,
    private pusherService: PusherService
) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('messages')
  async messages(
    @Body('username') username: string,
    @Body('message') message: string,
  ) {
    console.log(username, message)
    await this.pusherService.trigger('chat', 'message', {
      username,
      message,
    });
    return [];
  }
}
