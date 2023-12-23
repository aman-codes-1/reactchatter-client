"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.ALLOWED_DOMAINS?.includes(",")
            ? process.env.ALLOWED_DOMAINS?.split(",")
            : process.env.ALLOWED_DOMAINS,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    });
    app.use((0, cookie_parser_1.default)());
    await app.listen(8000);
}
bootstrap();
//# sourceMappingURL=main.js.map