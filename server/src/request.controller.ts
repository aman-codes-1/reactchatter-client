import { Body, Controller, Post } from "@nestjs/common";
import { RequestService } from "./request.service";

@Controller("request")
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post("send")
  async send(
    @Body("sendToEmail") sendToEmail: string,
    @Body("sentByUserId") sentByUserId: string,
  ) {
    const requestData = await this.requestService.sendRequest({
      sendToEmail,
      sentByUserId,
    });
    return {
      data: requestData,
      message: "success",
    };
  }

  @Post("respond")
  async respond(
    @Body("requestId") requestId: string,
    @Body("status") status: string,
  ) {
    const requestData = await this.requestService.respondToRequest({
      requestId,
      status,
    });
    return {
      data: requestData,
      message: "success",
    };
  }

  @Post("sent")
  async sent(@Body("sentByUserId") sentByUserId: string) {
    const requestData = await this.requestService.sentRequests({
      sentByUserId,
    });
    return {
      data: requestData,
      message: "success",
    };
  }

  @Post("received")
  async received(@Body("sentByUserId") sentByUserId: string) {
    const requestData = await this.requestService.receiveRequests({
      sentByUserId,
    });
    return {
      data: requestData,
      message: "success",
    };
  }
}
