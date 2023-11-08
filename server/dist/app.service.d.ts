import * as Pusher from 'pusher';
export declare class AppService {
    getHello(): string;
}
export declare class PusherService {
    pusher: Pusher;
    constructor();
    trigger(channel: string, event: string, data: any): Promise<void>;
}
