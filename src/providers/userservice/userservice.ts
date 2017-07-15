import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AuthProvider} from "../../providers/auth/auth";

/*
  Generated class for the UserserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserserviceProvider {
  userID:number;

  constructor(private readonly authProvider: AuthProvider) {
    this.authProvider.authUser.subscribe(userinfo => {
      if (userinfo) {
        this.userID = Number(userinfo.userid);
      }
      else {
        this.userID = null;
      }
    });
  }

}
