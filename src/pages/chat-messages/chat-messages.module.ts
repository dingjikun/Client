import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatMessagesPage } from './chat-messages';
import { MomentModule } from 'angular2-moment';
import 'moment/locale/zh-cn';

@NgModule({
  declarations: [
    ChatMessagesPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatMessagesPage),
    MomentModule
  ],
  exports: [
    ChatMessagesPage
  ]
})
export class ChatMessagesPageModule {}
