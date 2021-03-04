import { Injectable } from "@angular/core";
import { NgxPubSubService } from "@pscoped/ngx-pub-sub";
import { io, Socket } from "socket.io-client";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  //
  public socket: Socket;

  //
  constructor(public eventService: NgxPubSubService) {}

  //
  initConnection() {
    const token = localStorage.getItem("userToken");
    this.socket = io(environment.BaseURL, {
      query: {
        token: token,
      },
    });
    this.socket.on("connect", () => {
      this.bindSocketEvents();
    });
  }

  //
  bindSocketEvents() {
    console.log("Connected...");
    this.socket.on("reply", (data) => {
      this.eventService.publishEvent("onreply", data);
    });

    this.socket.on("alert-resolved", (alertId) => {
      this.eventService.publishEvent("alert-resolved", alertId);
    });
  }
}
