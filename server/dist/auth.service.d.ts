import { Model } from "mongoose";
import { UserDocument } from "./user.schema";
export declare class AuthService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    login({ email, name, image, }: {
        email: string;
        name: string;
        image: string;
    }): Promise<any>;
}
