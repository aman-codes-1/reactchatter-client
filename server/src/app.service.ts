import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

export class PusherService {
  constructor() {
  }

  async trigger(channel: string, event: string, data: any) {
    const pusher = new Pusher({
      appId: '1701877',
      key: '58b0ec4905821bf0b6de',
      secret: '075286a370da33dbcf4d',
      cluster: 'ap2',
      useTLS: true,
    });
    await pusher.trigger(channel, event, data);
  }
}
