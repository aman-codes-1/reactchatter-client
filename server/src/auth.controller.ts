import { BadRequestException, Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { AuthService } from "./auth.service";
import { RequestService } from "./request.service";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private requestService: RequestService,
  ) {}

  client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.CLIENT_URI}/login`,
  );

  @Post("google")
  async google(
    @Body() body: { code: string },
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const { code } = body;
    const { tokens } = await this.client.getToken(code);
    this.client.setCredentials(tokens);
    const ticket = await this.client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { iss, azp, aud, sub, at_hash, ...rest } = ticket.getPayload();
    const ticketData = { ...rest, ...tokens };
    const data = await this.authService.login(ticketData);
    response.cookie("auth", JSON.stringify(data), {
      httpOnly: true,
      domain: process.env.COOKIE_DOMAIN,
    });
    const authCookie = await request?.cookies?.["auth"];
    if (!authCookie) {
      throw new BadRequestException("Unable to login. Please try again later.");
    }
    const {
      iat,
      exp,
      access_token,
      refresh_token,
      scope,
      token_type,
      id_token,
      expiry_date,
      ...restData
    } = data || {};
    return {
      data: restData,
      message: "success",
    };
  }

  @Post("google/verifyToken")
  async verifyToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const authCookie = await request?.cookies?.["auth"];
    if (!authCookie) {
      throw new BadRequestException("Unable to login. Please try again later.");
    }
    let auth = authCookie !== undefined ? JSON.parse(authCookie || "{}") : {};
    const { refresh_token: refreshToken, expiry_date: expiryDate } = auth || {};
    this.client.setCredentials({
      refresh_token: refreshToken,
    });
    const today = new Date();
    today.setSeconds(today.getSeconds() - 60);
    if (expiryDate < today.getTime()) {
      const { res: { data = {} } = {} } = await this.client.getAccessToken();
      this.client.setCredentials({
        ...data,
      });
      auth = { ...auth, ...data };
      response.cookie("auth", JSON.stringify(auth), {
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });
    }
    const authData = await this.authService.login(auth);
    const {
      iat,
      exp,
      access_token,
      refresh_token,
      scope,
      token_type,
      id_token,
      expiry_date,
      ...restData
    } = authData || {};
    return {
      data: restData,
      message: "success",
    };
  }
}
