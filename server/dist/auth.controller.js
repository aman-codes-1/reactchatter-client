"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const google_auth_library_1 = require("google-auth-library");
const auth_service_1 = require("./auth.service");
const request_service_1 = require("./request.service");
let AuthController = class AuthController {
    constructor(authService, requestService) {
        this.authService = authService;
        this.requestService = requestService;
        this.client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CLIENT_REDIRECT_URI);
    }
    async google(body, response) {
        const { code } = body;
        const { tokens } = await this.client.getToken(code);
        this.client.setCredentials(tokens);
        const ticket = await this.client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { iss, azp, aud, sub, at_hash, ...rest } = ticket.getPayload();
        const ticketData = { ...rest, ...tokens };
        const data = await this.authService.login(ticketData);
        response.cookie("auth", JSON.stringify(data), {
            httpOnly: true,
        });
        const { iat, exp, access_token, refresh_token, scope, token_type, id_token, expiry_date, ...restData } = data || {};
        return {
            data: restData,
            message: "success",
        };
    }
    async verifyToken(request, response) {
        const authCookie = request?.cookies?.["auth"];
        let auth = authCookie !== undefined ? JSON.parse(authCookie || "{}") : {};
        const { refresh_token: refreshToken, expiry_date: expiryDate } = auth || {};
        this.client.setCredentials({
            refresh_token: refreshToken,
        });
        const today = new Date();
        today.setSeconds(today.getSeconds() - 60);
        if (expiryDate < today.getTime()) {
            const { res: { data = {} } = {} } = await this.client.getAccessToken();
            this.client.setCredentials({
                ...data,
            });
            auth = { ...auth, ...data };
            response.cookie("auth", JSON.stringify(auth), {
                httpOnly: true,
            });
        }
        const authData = await this.authService.login(auth);
        const { iat, exp, access_token, refresh_token, scope, token_type, id_token, expiry_date, ...restData } = authData || {};
        return {
            data: restData,
            message: "success",
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("google"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "google", null);
__decorate([
    (0, common_1.Get)("google/verifyToken"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        request_service_1.RequestService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map