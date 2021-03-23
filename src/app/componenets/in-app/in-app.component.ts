import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-in-app',
  templateUrl: './in-app.component.html',
  styleUrls: ['./in-app.component.less']
})
export class InAppComponent implements OnInit {

  // vars
  receipt: string = ''
  isSubmitted: boolean

  // 
  selectedAppType: string
  androidOrderId

  // 
  constructor(public httpService: HttpService, private toastr: ToastrService) { }

  // 
  ngOnInit(): void {
    this.init()
  }

  // 
  init() {
    this.isSubmitted = false
    this.selectedAppType = 'ios'
    this.androidOrderId = '1_campuswatch'
  }

  // 
  onSubmit() {
    this.isSubmitted = true
    if (!this.receipt) return

    // 
    let purchaseData = (this.selectedAppType == 'ios') ? { transactionReceipt: this.receipt } : {
      productId: this.androidOrderId,
      purchaseToken: this.receipt
    }

    // 
    let payload = {
      appType: this.selectedAppType,
      purchase: purchaseData
    }

    // 
    this.httpService.post('user/in-app-purchase/subscribe', payload).subscribe((response: any) => {
      console.log("On Response: ", response)
      this.toastr.success(response.message)
    }, (err: any) => {
      console.log("On Error: ", err)
      this.toastr.error(err.message)
    }, () => {
      this.isSubmitted = false
    })
  }
}
