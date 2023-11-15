import { Body, Controller, Post } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { AuthService } from "./auth.service";
import 'dotenv/config';

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body("token") token: string): Promise<any> {
    const client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();
    const data = await this.authService.login({ email, name, image: picture });
    return {
      data,
      message: "success",
    };
  }
}
