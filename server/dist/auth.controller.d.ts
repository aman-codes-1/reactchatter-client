import { AuthService } from "./auth.service";
import 'dotenv/config';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(token: string): Promise<any>;
}
