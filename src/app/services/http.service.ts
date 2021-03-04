import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // 
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // 
  constructor(private http: HttpClient, public auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) {
      this.updateHeaderToken(this.auth.getToken())
      let userId = localStorage.getItem('userId')
      if (userId) {
        // this.auth.setUserId(userId)
        this.auth.userId = userId
      }
    }
  }

  // 
  get(url) {
    return this.http.get(environment.ApiURL + url, this.httpOptions)
  }

  // 
  post(url, payload) {
    return this.http.post(environment.ApiURL + url, payload, this.httpOptions)
  }

  // 
  put(url, payload) {
    return this.http.put(environment.ApiURL + url, payload, this.httpOptions)
  }

  // 
  delete(url) {
    return this.http.delete(environment.ApiURL + url, this.httpOptions)
  }

  // 
  updateHeaderToken(token) {
    this.auth.setToken(token)
    this.httpOptions.headers = this.httpOptions.headers.delete('Authorization')
    this.httpOptions.headers = this.httpOptions.headers.append('Authorization', token)
  }

  // 
  navigate(url) {
    this.router.navigate([url])
  }
}
