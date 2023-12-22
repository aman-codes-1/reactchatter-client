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
exports.FriendService = void 0;
const mongodb_1 = require("mongodb");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const friend_schema_1 = require("./friend.schema");
let FriendService = class FriendService {
    constructor(friendModel) {
        this.friendModel = friendModel;
    }
    async addFriend(addFriendData) {
        const { sentByUserId, sentToUserId } = addFriendData;
        const sentByUserObjectId = new mongodb_1.ObjectId(sentByUserId);
        const sentToUserObjectId = new mongodb_1.ObjectId(sentToUserId);
        const duplicateFriend1 = await this.friendModel
            .findOne({
            $and: [
                { userId: sentToUserObjectId },
                { addedByUserId: sentByUserObjectId },
                { isFriend: true },
            ],
        })
            .lean();
        const duplicateFriend2 = await this.friendModel
            .findOne({
            $and: [
                { userId: sentByUserObjectId },
                { addedByUserId: sentToUserObjectId },
                { isFriend: true },
            ],
        })
            .lean();
        if (duplicateFriend1 || duplicateFriend2) {
            throw new common_1.BadRequestException("Already a Friend.");
        }
        else {
            const newFriend = new this.friendModel({
                userId: sentToUserObjectId,
                addedByUserId: sentByUserObjectId,
                isFriend: true,
            });
            await newFriend.save();
            return newFriend?._doc ? newFriend?._doc : newFriend;
        }
    }
    async getAllFriends(getAllFriendsData) {
        const { userId } = getAllFriendsData;
        const userObjectId = new mongodb_1.ObjectId(userId);
        const friends = await this.friendModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: ["$isFriend", true] },
                            {
                                $or: [
                                    { $eq: ["$userId", userObjectId] },
                                    { $eq: ["$addedByUserId", userObjectId] },
                                ],
                            },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$userId", addedByUserId: "$addedByUserId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $or: [
                                                { $eq: ["$_id", "$$userId"] },
                                                { $eq: ["$_id", "$$addedByUserId"] },
                                            ],
                                        },
                                        {
                                            $not: [{ $eq: ["$_id", userObjectId] }],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: "$_id",
                                __v: "$__v",
                                name: "$name",
                                email: "$email",
                                email_verified: "$email_verified",
                                picture: "$picture",
                                given_name: "$given_name",
                                family_name: "$family_name",
                                locale: "$locale",
                            },
                        },
                    ],
                    as: "friendDetails",
                },
            },
            {
                $unwind: {
                    path: "$friendDetails",
                },
            },
            { $project: { userId: false, addedByUserId: false } },
        ]);
        return friends;
    }
};
exports.FriendService = FriendService;
exports.FriendService = FriendService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(friend_schema_1.Friend.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FriendService);
//# sourceMappingURL=friend.service.js.map