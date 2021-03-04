import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  // re
  loginForm: FormGroup;
  isFormSubmitted: boolean = false
  numPattern = /[0-9]/

  // 
  constructor(private _http: HttpService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.init()
  }

  init() {
    this.loginForm = new FormGroup({
      'sEmail': new FormControl('', [Validators.required, Validators.email]),
      'sPassword': new FormControl('', [Validators.required])
    })
    if (this._http.auth.isLoggedIn()) this._http.navigate('/dashboard')
  }

  loginUser() {
    this.isFormSubmitted = true;
    if (this.loginForm.valid) {
      const payload = this.loginForm.value
      this._http.post('user/login', payload).subscribe((response: any) => {
        this._http.updateHeaderToken(response.Authorization)
        this._http.auth.setUserId(response.data._id)
        this._http.navigate('/dashboard')
      }, (error) => {
        console.log("Error in user logging in: ", error)
        let message = (error && error.error && error.error.message) ? error.error.message : 'Something went wrong!'
        this.toastr.error(message)
      })
    }
  }

  get lf() { return this.loginForm.controls }

}
