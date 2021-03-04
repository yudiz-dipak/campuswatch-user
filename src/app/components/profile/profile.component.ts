import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

  updateProfileForm: FormGroup
  isFormSubmitted: boolean = false
  numPattern = /[0-9]/

  // 
  constructor(private http: HttpService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.init()
  }

  init() {
    if (!this.http.auth.isLoggedIn()) {
      this.http.navigate('/login')
    }
    if (!this.http.auth.userData) {
      this.http.auth._socket.eventService.subscribe('userDataFound', () => {
        this.prepareForm()
      })
    }
    else {
      this.prepareForm()
    }
  }

  prepareForm() {
    const userData = this.http.auth.userData
    this.updateProfileForm = new FormGroup({
      'sFirstName': new FormControl(userData.sFirstName, [Validators.required]),
      'sLastName': new FormControl(userData.sLastName, [Validators.required]),
      'sEmail': new FormControl(userData.sEmail, [Validators.required, Validators.email]),
      'sAddress': new FormControl(userData.sAddress, [Validators.required]),
      'sSuite': new FormControl(userData.sSuite, [Validators.required]),
      'sCity': new FormControl(userData.sCity, [Validators.required]),
      'sState': new FormControl(userData.sState, [Validators.required]),
      'sPhoneNumber': new FormControl(userData.sPhoneNumber, [Validators.required]),
      'nZipCode': new FormControl(userData.nZipCode, [Validators.required, Validators.pattern(this.numPattern)]),
      'isSubscribed': new FormControl(userData.isSubscribed, [Validators.required]),
    })
  }

  updateProfile() {
    this.isFormSubmitted = true;
    if (this.updateProfileForm.valid) {
      const payload = this.updateProfileForm.value
      if (payload.sEmail == this.http.auth.userData.sEmail) {
        delete payload.sEmail
      }
      console.log("Data: ", payload)
      this.http.put('user/profile', payload).subscribe((response: any) => {
        console.log("User Profile updated! ", response)
        this.toast.success('Updated Successfully')
        this.http.auth.userData = response.data
      }, (error) => {
        this.toast.error('Something went wrong')
        console.log("Error in user registeration: ", error)
      })
    }
  }

  get pf() { return this.updateProfileForm.controls }

}
