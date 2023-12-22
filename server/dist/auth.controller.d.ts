import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { AuthService } from "./auth.service";
import { RequestService } from "./request.service";
export declare class AuthController {
    private authService;
    private requestService;
    constructor(authService: AuthService, requestService: RequestService);
    client: OAuth2Client;
    google(body: {
        code: string;
    }, response: Response): Promise<any>;
    verifyToken(request: Request, response: Response): Promise<any>;
}
