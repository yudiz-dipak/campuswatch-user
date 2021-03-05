import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  // re
  regForm: FormGroup;
  isFormSubmitted: boolean = false
  numPattern = /[0-9]/

  // 
  constructor(private _http: HttpService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.init()
  }

  init() {
    this.regForm = new FormGroup({
      'sName': new FormControl('', [Validators.required]),
      'sEmail': new FormControl('', [Validators.required, Validators.email]),
      'sPassword': new FormControl('', [Validators.required]),
      'isSubscribed': new FormControl('', [Validators.required]),
    })
    if (this._http.auth.isLoggedIn()) this._http.navigate('/dashboard')
  }

  registerUser() {
    this.isFormSubmitted = true;
    if (this.regForm.valid) {
      const payload = this.regForm.value
      console.log("Data: ", payload)
      this._http.post('user/register', payload).subscribe((response: any) => {
        console.log("User Registered! ", response)
        this._http.updateHeaderToken(response.Authorization)
        this._http.auth.setUserId(response.data._id)
        this._http.navigate('/dashboard')
      }, (error) => {
        console.log("Error in user registration: ", error)
        let message = (error && error.error && error.error.message) ? error.error.message : 'Something went wrong!'
        this.toastr.error(message)
      })
    }
  }

  get rf() { return this.regForm.controls }
}
