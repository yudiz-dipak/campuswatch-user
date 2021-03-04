import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'user-panel';

  constructor(private _http: HttpService) { }

  ngOnInit() {
    if (this._http.auth.isLoggedIn()) {
      
    }
  }
}
