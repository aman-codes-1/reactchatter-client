export declare class AppService {
    getHello(): string;
}
export declare class PusherService {
    constructor();
    trigger(channel: string, event: string, data: any): Promise<void>;
}
