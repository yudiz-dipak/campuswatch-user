import { Component, OnInit } from '@angular/core';
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
  constructor(public httpService: HttpService) { }

  // 
  ngOnInit(): void {
    this.init()
  }

  // 
  init() {
    this.isSubmitted = false
  }

  // 
  onSubmit() {
    this.isSubmitted = true
    if (!this.receipt) return

    // 
    let payload = {
      receipt: this.receipt
    }

    // 
    this.httpService.post('user/in-app-purchase/subscribe', payload).subscribe((response: any) => {
      console.log("On Response: ", response)
    }, (err: any) => {
      console.log("On Error: ", err)
    }, () => {
      this.isSubmitted = false
    })
  }
}
