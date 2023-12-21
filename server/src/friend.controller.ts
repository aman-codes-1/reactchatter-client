import { Body, Controller, Post } from "@nestjs/common";
import { FriendService } from "./friend.service";

@Controller("friend")
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Post("all")
  async allFriends(@Body("userId") userId: string) {
    const friendsData = await this.friendService.getAllFriends({
      userId,
    });
    return {
      data: friendsData,
      message: "success",
    };
  }
}
