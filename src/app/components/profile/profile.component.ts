import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

  // Update user profile
  updateProfileForm: FormGroup
  numPattern = /[0-9]/

  // change password
  changePasswordForm: FormGroup

  // global vars
  showChangePassword: boolean = false
  isFormSubmitted: boolean = false

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

  imageSrc: any = ''
  onFileSelected(files: File[]) {
    if (!files || !files.length) return
    console.log("Files : ", files)
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageSrc = e.target.result;
    };
    reader.readAsDataURL(files[0])
    this.uploadProfilePicture(files[0])

  }

  // 
  uploadProfilePicture(file: File) {
    let payload = {
      sContentType: file.type,
      sFileName: file.name
    }
    this.http.post('user/signedurl/profilepicture', payload).subscribe((response: any) => {
      let sPath = response.data.sPath,
        sUrl = response.data.sUrl;

      // 
      this.http.http.put(sUrl, file).subscribe(response => {
        let payload2 = {
          sProfilePicture: sPath
        }
        this.http.post('user/set/sProfilePicture', payload2).subscribe((response: any) => {
          this.imageSrc = environment.S3_BUCKET_URL + sPath
        })
      })
    })
  }

  prepareForm() {
    const userData = this.http.auth.userData
    this.updateProfileForm = new FormGroup({
      'sName': new FormControl(userData.sName, [Validators.required]),
      'sEmail': new FormControl(userData.sEmail, [Validators.required, Validators.email]),
      'sPassword': new FormControl(''),
      'isSubscribed': new FormControl(userData.isSubscribed, [Validators.required]),
    })
    if (userData.sProfilePicture) this.imageSrc = environment.S3_BUCKET_URL + userData.sProfilePicture

    // 
    this.changePasswordForm = new FormGroup({
      'sOldPassword': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'sNewPassword': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'sNewRetypedPassword': new FormControl('', [Validators.required])
    }, this.matchPasswordCheck)
  }

  matchPasswordCheck(form: FormGroup): any {
    if (form.get('sNewRetypedPassword').value && form.get('sNewPassword').value != form.get('sNewRetypedPassword').value) {
      form.get('sNewRetypedPassword').setErrors({ mismatch: true })
    }
  }

  updateProfile() {
    this.isFormSubmitted = true;
    if (this.updateProfileForm.valid) {
      const payload = this.updateProfileForm.value
      if (payload.sEmail == this.http.auth.userData.sEmail) {
        delete payload.sEmail
      }
      this.http.put('user/profile', payload).subscribe((response: any) => {
        console.log("User Profile updated! ", response)
        this.toast.success(response.message)
        this.http.auth.userData = response.data
      }, (error) => {
        this.toast.error('Something went wrong')
        console.log("Error in user registration: ", error)
      })
    }
  }

  changePassword() {
    this.isFormSubmitted = true;
    if (!this.changePasswordForm.valid) return
    const payload = this.changePasswordForm.value
    this.http.post('user/password/change', payload).subscribe((response: any) => {
      console.log("Password changed! ", response)
      this.toast.success(response.message)
      this.http.auth.userData.sPassword = this.pf.sPassword.value
      // this.http.auth.userData = response.data
    }, (error) => {
      let message = (error && error.error && error.error.message) ? error.error.message : 'Something went wrong'
      this.toast.error(message)
      console.log("Error in user registration: ", error)
    })
  }

  get pf() { return this.updateProfileForm.controls }
  get cf() { return this.changePasswordForm.controls }

}
