import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-new-alert",
  templateUrl: "./new-alert.component.html",
  styleUrls: ["./new-alert.component.less"],
})
export class NewAlertComponent implements OnInit {
  //
  alertCategories: any = [];
  newAlertObj = {
    providerId: "60114c70b4d91c05f6f76795",
    position: {
      lat: 24.242001,
      long: 68.666931,
    },
    userId: this._http.auth.userId,
    alertCategoryId: "null",
  };

  //
  constructor(private _http: HttpService, private toast: ToastrService) {}

  //
  ngOnInit(): void {
    this.init();
  }

  //
  init() {
    this.getAlertCategories();
  }

  //
  getAlertCategories() {
    this._http.get("alert-category/list-enabled").subscribe((response: any) => {
      this.alertCategories = [].concat(response.data);
    });
  }

  //
  createAlert() {
    this._http.auth._socket.socket.emit("createNewAlert", this.newAlertObj);
    this.toast.success("Success", "New Alert Created!");
    this.newAlertObj.alertCategoryId = "null";
    // this._http.post('alerts', this.newAlertObj).subscribe((response) => {
    //   this.toast.success('Success', 'New Alert Created!')
    //   this.newAlertObj.alertCategoryId = 'null'
    // })
  }
}
