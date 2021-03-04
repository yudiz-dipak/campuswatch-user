import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit {

  // re
  forgotPasswordForm: FormGroup;
  isFormSubmitted: boolean = false

  // 
  constructor(private _http: HttpService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.init()
  }

  init() {
    this.forgotPasswordForm = new FormGroup({
      'sEmail': new FormControl('', [Validators.required, Validators.email])
    })
    if (this._http.auth.isLoggedIn()) this._http.navigate('/dashboard')
  }

  sendResetPasswordMail() {
    this.isFormSubmitted = true;
    if (this.forgotPasswordForm.valid) {

      const payload = this.forgotPasswordForm.value

      this._http.post('user/forgot/password/mail', payload).subscribe((response: any) => {
        this.toastr.success('Password reset mail has been sent! Please check your email')
        this._http.navigate('/login')
      }, (error) => {
        console.log("Error resseting forgot password: ", error)
        let message = (error && error.error && error.error.message) ? error.error.message : 'Something went wrong!'
        this.toastr.error(message)
      })
    }
  }

  get fpf() { return this.forgotPasswordForm.controls }

}
