import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import {ReplaySubject, Observable} from "rxjs";
import {Storage} from "@ionic/storage";
import {JwtHelper, AuthHttp} from "angular2-jwt";
import {SERVER_URL} from "../../config";

@Injectable()
export class AuthProvider {

  authUser = new ReplaySubject<any>(1);

  constructor(private readonly http: Http,
              private readonly authHttp: AuthHttp,
              private readonly storage: Storage,
              private readonly jwtHelper: JwtHelper) {
  }

  checkLogin() {
    this.storage.get('userinfo').then(userinfo => {

      if (userinfo && !this.jwtHelper.isTokenExpired(userinfo.jwt)) {
        this.authHttp.get(`${SERVER_URL}/authenticate`)
          .subscribe(() => this.authUser.next(userinfo),
            (err) => this.logout());
      }
      else {
        this.logout();
      }
    });
  }

  login(values: any): Observable<any> {
    return this.http.post(`${SERVER_URL}/login`, values)
      .map(response => response.json())
      .map(userinfo => this.handleJwtResponse(userinfo));
  }

  logout() {
    let promises = [this.storage.remove('jwt'), this.storage.remove('userinfo')];
    Promise.all(promises).then(() => this.authUser.next(null));
  }

  signup(values: any): Observable<any> {
    return this.http.post(`${SERVER_URL}/signup`, values)
      .map(response => response.json())
      .map(userinfo => {
        if (userinfo.jwt !== 'EXISTS') {
          return this.handleJwtResponse(userinfo);
        }
        else {
          return userinfo.jwt;
        }
      });
  }

  private handleJwtResponse(userinfo: any) {
    let promises = [this.storage.set('jwt', userinfo.jwt), this.storage.set('userinfo', userinfo)];
    return Promise.all(promises)
      .then(() => this.authUser.next(userinfo))
      .then(() => userinfo.jwt);
  }

}
