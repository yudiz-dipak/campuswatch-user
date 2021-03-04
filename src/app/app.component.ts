import { Component } from "@angular/core";
import { HttpService } from "./services/http.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent {
  title = "user-panel";
  message;

  constructor(
    private _http: HttpService
  ) {}

  ngOnInit() {
    if (this._http.auth.isLoggedIn()) {
      
    }
  }
}
