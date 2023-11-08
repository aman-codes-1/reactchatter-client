import { AppService, PusherService } from './app.service';
export declare class AppController {
    private readonly appService;
    private pusherService;
    constructor(appService: AppService, pusherService: PusherService);
    getHello(): string;
    messages(username: string, message: string): Promise<any[]>;
}
