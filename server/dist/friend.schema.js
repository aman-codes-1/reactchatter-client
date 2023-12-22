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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendSchema = exports.Friend = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
class DocumentResult {
}
let Friend = class Friend extends DocumentResult {
};
exports.Friend = Friend;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Friend.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Friend.prototype, "addedByUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Friend.prototype, "isFriend", void 0);
exports.Friend = Friend = __decorate([
    (0, mongoose_1.Schema)()
], Friend);
exports.FriendSchema = mongoose_1.SchemaFactory.createForClass(Friend);
//# sourceMappingURL=friend.schema.js.map