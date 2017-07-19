import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatChatsPage } from './chat-chats';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    ChatChatsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatChatsPage),
    MomentModule
  ],
  exports: [
    ChatChatsPage
  ]
})
export class ChatChatsPageModule {}
