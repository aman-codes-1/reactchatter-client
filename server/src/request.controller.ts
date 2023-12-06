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

  // @Post("received")
  // async received(
  //   @Body("userId") userId: string,
  // ) {
  //   const requestData = await this.requestService.receiveRequests({ sendToEmail, sentByUserId });
  //   return {
  //     data: requestData,
  //     message: "success",
  //   };
  // }
}
