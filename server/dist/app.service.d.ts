import 'dotenv/config';
export declare class AppService {
    getHello(): string;
}
export declare class PusherService {
    pusher: any;
    constructor();
    trigger(channel: string, event: string, data: any): Promise<void>;
}
