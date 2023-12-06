import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { Request, RequestDocument } from "./request.schema";
import { ObjectId } from "mongodb";

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
  ) {}
  async sendRequest(requestData: any): Promise<any> {
    const { sentByUserId, sendToEmail } = requestData || {};
    const sentByUserObjectId = new ObjectId(sentByUserId);
    const user = await this.userModel.findOne({ email: sendToEmail }).lean();
    if (!user) {
      throw new BadRequestException("User not found.");
    } else {
      const { _id } = (user as any) || {};
      const _idObjectId = new ObjectId(_id);
      const _idToString = _idObjectId.toString();
      const duplicateRequest = await this.requestModel
        .findOne({
          $and: [{ sentToUserId: _id }, { sentByUserId: sentByUserObjectId }],
          $or: [{ status: "pending" }, { status: "accepted" }],
        })
        .lean();
      if (_idToString === sentByUserId) {
        throw new BadRequestException(
          "Please send a friend request to a different user.",
        );
      } else if (duplicateRequest) {
        const { status } = duplicateRequest;
        if (status === "accepted") {
          throw new BadRequestException("Already a Friend.");
        } else {
          throw new BadRequestException("Friend Request already sent.");
        }
      } else {
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

  async sentRequests(requestData: any): Promise<any> {
    const { sentByUserId } = requestData || {};
    const sentByUserObjectId = new ObjectId(sentByUserId);
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
                name: "$name",
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
      // { $replaceRoot: { newRoot: "$sentToUser" } },
    ]);
    return sentToUsers;
  }

  // async receiveRequests(requestData: any): Promise<any> {
  //   const { sentByUserId, sendToEmail } = requestData || {};
  //   const user = await this.userModel.findOne({ email: sendToEmail }).lean();
  //   if (!user) {
  //     throw new BadRequestException("User not found.");
  //   } else {
  //     const { _id } = (user as any) || {};
  //     const request = await this.requestModel
  //       .findOne({ sentToUserId: new ObjectId(_id).toString() })
  //       .lean();
  //     if (new ObjectId(_id).toString() === sentByUserId) {
  //       throw new BadRequestException(
  //         "Please send a friend request to a different user.",
  //       );
  //     } else if (request) {
  //       throw new BadRequestException("Friend Request already sent.");
  //     } else {
  //       const newRequest = new this.requestModel({
  //         ...requestData,
  //         sentToUserId: _id,
  //         status: "pending",
  //       });
  //       await newRequest.save();
  //       return newRequest?._doc ? newRequest?._doc : newRequest;
  //     }
  //   }
  // }
}
