import { Injectable } from "@angular/core";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { BehaviorSubject } from "rxjs";
import { SocketService } from "./socket.service";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private socket: SocketService
  ) {}

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    // this.angularFireAuth.authState.pipe(take(1)).subscribe(() => {
    //   const data = {};
    //   data[userId] = token;
    //   this.angularFireDB.object("fcmTokens/").update(data);
    // });
    this.socket.socket.emit("update-firebase-token-user", {
      userId: userId,
      token: token,
    });
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        this.updateToken(userId, token);
      },
      (err) => {
        console.error("Unable to get permission to notify.", err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload) => {
      console.log("new message received. ", payload);
      this.currentMessage.next(payload);
    });
    this.angularFireMessaging.onMessage(this.currentMessage)
  }
}
