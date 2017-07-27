import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController, AlertController } from 'ionic-angular';
import { Observable, Subscriber } from 'rxjs';
import { Chat, Message, MessageType } from '../../models/chatmodels';
import * as moment from 'moment';

/**
 * Generated class for the ChatChatsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-chat-chats',
  templateUrl: 'chat-chats.html',
})
export class ChatChatsPage {
  chats: Observable<Chat[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,) {
    
  }

  ionViewDidLoad() {
    this.chats = this.findChats();
  }

  private findChats(): Observable<Chat[]> {
    return Observable.of([
      {
        _id: '0',
        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
        lastMessage: {
          content: 'You on your way?',
          createdAt: moment().subtract(1, 'hours').toDate(),
          type: MessageType.TEXT
        }
       },
      {
        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
        lastMessage: {
          content: 'Hey, it\'s me',
          createdAt: moment().subtract(2, 'hours').toDate(),
          type: MessageType.TEXT
        }
      },
      {
        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
        lastMessage: {
          content: 'I should buy a boat',
          createdAt: moment().subtract(1, 'days').toDate(),
          type: MessageType.TEXT
        }
      },
      {
        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
        lastMessage: {
          content: 'Look at my mukluks!',
          createdAt: moment().subtract(4, 'days').toDate(),
          type: MessageType.TEXT
        }
      },
      {
        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
        lastMessage: {
          content: 'This is wicked good ice cream.',
          createdAt: moment().subtract(2, 'weeks').toDate(),
          type: MessageType.TEXT
        }
      }
    ]);
  }

  showMessages(chat): void {
    this.navCtrl.push('ChatMessagesPage', {chat});
  }

}
