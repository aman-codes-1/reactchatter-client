import { Body, Controller, Post } from '@nestjs/common';
import { PusherService } from './pusher.service';

@Controller('api')
export class PusherController {
  constructor(private PusherServices: PusherService) {
    //
  }

  @Post('messages')
  async messages(
    @Body('username') username: string,
    @Body('message') message: string,
  ) {
    await this.PusherServices.trigger('chat', 'message', {
      username,
      message,
    });
    return [];
  }
}
