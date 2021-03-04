import { Injectable } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 
  userId: any = null;
  userData: any = null;

  // 
  constructor(public _socket: SocketService) {
  }

  // 
  isLoggedIn() {
    return !!localStorage.getItem('userToken')
  }

  // 
  setToken(token) {
    this.removeToken()
    localStorage.setItem('userToken', token)
    this._socket.initConnection()
  }

  // 
  getToken() {
    return localStorage.getItem('userToken')
  }

  // 
  setUserId(userId) {
    this.userId = userId
    localStorage.setItem('userId', userId)
  }

  // 
  removeToken() {
    localStorage.removeItem('userToken')
    // localStorage.removeItem('userId')
    this.userId = null
  }
}
