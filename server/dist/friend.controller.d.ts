import { FriendService } from "./friend.service";
export declare class FriendController {
    private friendService;
    constructor(friendService: FriendService);
    allFriends(userId: string): Promise<{
        data: any;
        message: string;
    }>;
}
