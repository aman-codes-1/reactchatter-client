declare var Pusher: any;
import 'dotenv/config';
export declare class AppService {
    getHello(): string;
}
export declare class PusherService {
    pusher: typeof Pusher;
    constructor();
    trigger(channel: string, event: string, data: any): Promise<void>;
}
export {};
