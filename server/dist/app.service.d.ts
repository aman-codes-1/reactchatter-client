import * as Pusher from 'pusher';
import 'dotenv/config';
export declare class AppService {
    getHello(): string;
}
export declare class PusherService {
    pusher: Pusher;
    trigger(channel: string, event: string, data: any): Promise<void>;
}
