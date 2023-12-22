import { PusherService } from "./pusher.service";
export declare class PusherController {
    private pusherService;
    constructor(pusherService: PusherService);
    messages(username: string, message: string): Promise<any[]>;
}
