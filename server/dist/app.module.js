"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./user.schema");
const request_schema_1 = require("./request.schema");
const friend_schema_1 = require("./friend.schema");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const pusher_controller_1 = require("./pusher.controller");
const pusher_service_1 = require("./pusher.service");
const request_controller_1 = require("./request.controller");
const request_service_1 = require("./request.service");
const friend_controller_1 = require("./friend.controller");
const friend_service_1 = require("./friend.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI),
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema, collection: "users" },
            ]),
            mongoose_1.MongooseModule.forFeature([
                { name: request_schema_1.Request.name, schema: request_schema_1.RequestSchema, collection: "requests" },
            ]),
            mongoose_1.MongooseModule.forFeature([
                { name: friend_schema_1.Friend.name, schema: friend_schema_1.FriendSchema, collection: "friends" },
            ]),
        ],
        controllers: [
            app_controller_1.AppController,
            auth_controller_1.AuthController,
            pusher_controller_1.PusherController,
            request_controller_1.RequestController,
            friend_controller_1.FriendController,
        ],
        providers: [
            app_service_1.AppService,
            auth_service_1.AuthService,
            pusher_service_1.PusherService,
            request_service_1.RequestService,
            friend_service_1.FriendService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map