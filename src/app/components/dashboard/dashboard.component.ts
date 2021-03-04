import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  // 
  currentLastSeen: any = 'online';

  // 
  constructor(public _http: HttpService) { }

  // 
  ngOnInit(): void {
    this.init();
  }

  init() {
    if (!this._http.auth.isLoggedIn()) {
      this._http.navigate('/login')
    }
    else {
      this._http.get('user/profile').subscribe((response: any) => {
        this._http.auth.userData = response.data
        this._http.auth._socket.eventService.publishEvent('userDataFound')
        this.currentLastSeen = response.data.lastSeen == 'online' ? 'online' : 'offline'
      })
    }
  }

  updateLastSeen() {
    let lastSeen = (this.currentLastSeen == 'online') ? this.currentLastSeen : new Date()
    this._http.auth._socket.socket.emit('updateLastSeen', { userId: this._http.auth.userData._id, lastSeen: lastSeen })
  }

  logout() {
    this._http.auth.removeToken()
    this._http.navigate('/login')
  }

}
