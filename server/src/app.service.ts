import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

export class PusherService {
  private pusher: Pusher;
  constructor() {
    this.pusher = new Pusher({
      appId: '1701877',
      key: '58b0ec4905821bf0b6de',
      secret: '075286a370da33dbcf4d',
      cluster: 'ap2',
      useTLS: true,
    });
  }

  async trigger(channel: string, event: string, data: any) {
    await this.pusher.trigger(channel, event, data);
  }
}
