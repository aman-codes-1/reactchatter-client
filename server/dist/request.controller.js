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
exports.RequestController = void 0;
const common_1 = require("@nestjs/common");
const request_service_1 = require("./request.service");
let RequestController = class RequestController {
    constructor(requestService) {
        this.requestService = requestService;
    }
    async send(sendToEmail, sentByUserId) {
        const requestData = await this.requestService.sendRequest({
            sendToEmail,
            sentByUserId,
        });
        return {
            data: requestData,
            message: "success",
        };
    }
    async respond(requestId, status) {
        const requestData = await this.requestService.respondToRequest({
            requestId,
            status,
        });
        return {
            data: requestData,
            message: "success",
        };
    }
    async sent(sentByUserId) {
        const requestData = await this.requestService.sentRequests({
            sentByUserId,
        });
        return {
            data: requestData,
            message: "success",
        };
    }
    async received(sentByUserId) {
        const requestData = await this.requestService.receiveRequests({
            sentByUserId,
        });
        return {
            data: requestData,
            message: "success",
        };
    }
};
exports.RequestController = RequestController;
__decorate([
    (0, common_1.Post)("send"),
    __param(0, (0, common_1.Body)("sendToEmail")),
    __param(1, (0, common_1.Body)("sentByUserId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "send", null);
__decorate([
    (0, common_1.Post)("respond"),
    __param(0, (0, common_1.Body)("requestId")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "respond", null);
__decorate([
    (0, common_1.Post)("sent"),
    __param(0, (0, common_1.Body)("sentByUserId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "sent", null);
__decorate([
    (0, common_1.Post)("received"),
    __param(0, (0, common_1.Body)("sentByUserId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "received", null);
exports.RequestController = RequestController = __decorate([
    (0, common_1.Controller)("request"),
    __metadata("design:paramtypes", [request_service_1.RequestService])
], RequestController);
//# sourceMappingURL=request.controller.js.map