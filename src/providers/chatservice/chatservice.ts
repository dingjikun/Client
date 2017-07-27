import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthProvider} from "../../providers/auth/auth";
import { StompService } from 'ng2-stomp-service';
import {CHAT_SERVER_URL} from '../../configs/config';
import {AuthHttp} from "angular2-jwt";
import {SERVER_URL} from "../../configs/config";
import {Observable, ReplaySubject} from "rxjs";
import { Message, MessageType } from '../../models/chatmodels';

/*
  Generated class for the ChatserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChatserviceProvider {
  userID:number;
  recvMessages = new ReplaySubject<Message>(1);

  constructor(private readonly authProvider: AuthProvider,
    private readonly stompService: StompService,
    private readonly authHttp: AuthHttp) {

    this.authProvider.authUser.subscribe(userinfo => {
      if (userinfo) {
        this.userID = Number(userinfo.userid);
        this.initStomp();
      }
      else {
        this.userID = null;
      }
    });
  }

  initStomp() {

    if (this.userID) {
      this.stompService.configure({
        host:`${CHAT_SERVER_URL}/ws`,
        debug:true,
        queue:{'init':false}
      });

      this.stompService.startConnect().then(() => {
        this.stompService.done('init');

        this.stompService.subscribe(`/queue/${this.userID}/exchange/message`, this.response);
      });
    }

  }

  private response = (data) => {
    this.recvMessages.next({
          _id:data.id.toString(),
          senderId: data.senderid.toString(),
          content: data.content,
          createdAt: new Date(data.createtime),
          type: MessageType.TEXT
        });
  }

  getMessages(messageParam:any): Observable<any>{
    return this.authHttp.post(`${SERVER_URL}/chat/getMessages`, JSON.stringify(messageParam))
      .map(response => response.json());
  }

  putMessage(messageParam:any): Observable<any> {
    return this.authHttp.post(`${SERVER_URL}/chat/putMessage`, JSON.stringify(messageParam))
      .map(response => {
        return response.json()});
  }

}
