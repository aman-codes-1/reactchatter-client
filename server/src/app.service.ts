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
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET,
      cluster: 'ap2', 
      useTLS: true,
    });
    await pusher.trigger(channel, event, data);
  }
}
