import { RequestService } from "./request.service";
export declare class RequestController {
    private requestService;
    constructor(requestService: RequestService);
    send(sendToEmail: string, sentByUserId: string): Promise<{
        data: any;
        message: string;
    }>;
    respond(requestId: string, status: string): Promise<{
        data: any;
        message: string;
    }>;
    sent(sentByUserId: string): Promise<{
        data: any;
        message: string;
    }>;
    received(sentByUserId: string): Promise<{
        data: any;
        message: string;
    }>;
}
