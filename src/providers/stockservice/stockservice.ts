import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AuthHttp} from "angular2-jwt";
import {SERVER_URL} from "../../configs/config";
import {Observable} from "rxjs";

/*
  Generated class for the StockserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class StockserviceProvider {
  constructor(private readonly authHttp: AuthHttp) {
  }

  getStock(stock:any): Observable<any>{
    return this.authHttp.post(`${SERVER_URL}/stock/getMediaInfo`, JSON.stringify(stock))
      .map(response => response.json());
  }

}
