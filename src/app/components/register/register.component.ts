import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  constructor(private _http: HttpService) { }

  ngOnInit(): void {
    this.init()
  }

  init() {
    this.regForm = new FormGroup({
      'sFirstName': new FormControl('', [Validators.required]),
      'sLastName': new FormControl('', [Validators.required]),
      'sEmail': new FormControl('', [Validators.required, Validators.email]),
      'sPassword': new FormControl('', [Validators.required]),
      'sAddress': new FormControl('', [Validators.required]),
      'sSuite': new FormControl('', [Validators.required]),
      'sCity': new FormControl('', [Validators.required]),
      'sState': new FormControl('', [Validators.required]),
      'sNotes': new FormControl('', [Validators.required]),
      'sHousehold': new FormControl('', [Validators.required]),
      'sPhoneNumber': new FormControl('', [Validators.required]),
      'nZipCode': new FormControl('', [Validators.required, Validators.pattern(this.numPattern)]),
      'isSubscribed': new FormControl('', [Validators.required]),
    })
    if (this._http.auth.isLoggedIn()) this._http.navigate('/dashboard')
  }

  registerUser() {
    this.isFormSubmitted = true;
    if (this.regForm.valid) {
      const payload = this.regForm.value
      console.log("Data: ", payload)
      this._http.post('user/register', payload).subscribe((response) => {
        console.log("User Registered! ", response)
      }, (error) => {
        console.log("Error in user registeration: ", error)
      })
    }
  }

  get rf() { return this.regForm.controls }
}
