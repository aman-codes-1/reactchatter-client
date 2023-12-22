declare var Pusher: any;
export declare class PusherService {
    pusher: typeof Pusher;
    constructor();
    trigger(channel: string, event: string, data: any): Promise<void>;
}
export {};
