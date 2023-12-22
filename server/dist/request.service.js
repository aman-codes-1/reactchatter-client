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
exports.RequestService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const request_schema_1 = require("./request.schema");
const friend_service_1 = require("./friend.service");
const mongodb_1 = require("mongodb");
let RequestService = class RequestService {
    constructor(userModel, requestModel, friendService) {
        this.userModel = userModel;
        this.requestModel = requestModel;
        this.friendService = friendService;
    }
    async sendRequest(requestData) {
        const { sentByUserId, sendToEmail } = requestData || {};
        const sentByUserObjectId = new mongodb_1.ObjectId(sentByUserId);
        const user = await this.userModel.findOne({ email: sendToEmail }).lean();
        if (!user) {
            throw new common_1.BadRequestException("User not found.");
        }
        else {
            const { _id } = user || {};
            const _idObjectId = new mongodb_1.ObjectId(_id);
            const _idToString = _idObjectId.toString();
            const duplicateRequestSent = await this.requestModel
                .findOne({
                $and: [{ sentToUserId: _id }, { sentByUserId: sentByUserObjectId }],
                $or: [{ status: "pending" }, { status: "accepted" }],
            })
                .lean();
            const duplicateRequestReceived = await this.requestModel
                .findOne({
                $and: [{ sentToUserId: sentByUserObjectId }, { sentByUserId: _id }],
                $or: [{ status: "pending" }, { status: "accepted" }],
            })
                .lean();
            if (_idToString === sentByUserId) {
                throw new common_1.BadRequestException("Please send a friend request to a different user.");
            }
            else if (duplicateRequestSent) {
                const { status } = duplicateRequestSent;
                if (status === "accepted") {
                    throw new common_1.BadRequestException("Already a Friend.");
                }
                else {
                    throw new common_1.BadRequestException("Friend Request already sent.");
                }
            }
            else if (duplicateRequestReceived) {
                const { status } = duplicateRequestReceived;
                if (status === "accepted") {
                    throw new common_1.BadRequestException("Already a Friend.");
                }
                else {
                    throw new common_1.BadRequestException("You already have a pending request from this user.");
                }
            }
            else {
                const newRequest = new this.requestModel({
                    sentByUserId: sentByUserObjectId,
                    sentToUserId: _idObjectId,
                    status: "pending",
                });
                await newRequest.save();
                return newRequest?._doc ? newRequest?._doc : newRequest;
            }
        }
    }
    async respondToRequest(requestData) {
        const { requestId, status } = requestData;
        const request = await this.requestModel.findById(requestId);
        let newFriend = {};
        if (status === "accepted") {
            newFriend = await this.friendService.addFriend(request);
        }
        const updatedRequest = await this.requestModel
            .findByIdAndUpdate({ _id: requestId }, { $set: { status } }, { new: true })
            .lean();
        return { ...updatedRequest, ...newFriend };
    }
    async sentRequests(requestData) {
        const { sentByUserId } = requestData || {};
        const sentByUserObjectId = new mongodb_1.ObjectId(sentByUserId);
        const sentToUsers = await this.requestModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: ["$status", "pending"] },
                            { $eq: ["$sentByUserId", sentByUserObjectId] },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$sentToUserId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$userId"],
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
                    as: "sentToUser",
                },
            },
            {
                $unwind: {
                    path: "$sentToUser",
                },
            },
            { $project: { sentToUser: true } },
        ]);
        return sentToUsers;
    }
    async receiveRequests(requestData) {
        const { sentByUserId } = requestData || {};
        const sentByUserObjectId = new mongodb_1.ObjectId(sentByUserId);
        const receivedByUsers = await this.requestModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: ["$status", "pending"] },
                            { $eq: ["$sentToUserId", sentByUserObjectId] },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$sentByUserId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$userId"],
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
                    as: "receivedByUser",
                },
            },
            {
                $unwind: {
                    path: "$receivedByUser",
                },
            },
            { $project: { receivedByUser: true } },
        ]);
        return receivedByUsers;
    }
};
exports.RequestService = RequestService;
exports.RequestService = RequestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(request_schema_1.Request.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        friend_service_1.FriendService])
], RequestService);
//# sourceMappingURL=request.service.js.map