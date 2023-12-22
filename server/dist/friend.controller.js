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
exports.FriendController = void 0;
const common_1 = require("@nestjs/common");
const friend_service_1 = require("./friend.service");
let FriendController = class FriendController {
    constructor(friendService) {
        this.friendService = friendService;
    }
    async allFriends(userId) {
        const friendsData = await this.friendService.getAllFriends({
            userId,
        });
        return {
            data: friendsData,
            message: "success",
        };
    }
};
exports.FriendController = FriendController;
__decorate([
    (0, common_1.Post)("all"),
    __param(0, (0, common_1.Body)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FriendController.prototype, "allFriends", null);
exports.FriendController = FriendController = __decorate([
    (0, common_1.Controller)("friend"),
    __metadata("design:paramtypes", [friend_service_1.FriendService])
], FriendController);
//# sourceMappingURL=friend.controller.js.map