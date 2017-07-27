import { Component,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chat, Message, MessageType } from '../../models/chatmodels';
import { Subscription, Observable, Subscriber } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'underscore';
import { ChatserviceProvider } from '../../providers/chatservice/chatservice';

/**
 * Generated class for the ChatMessagesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-chat-messages',
  templateUrl: 'chat-messages.html',
})
export class ChatMessagesPage {
  selectedChat: Chat;
  title: string;
  picture: string;
  messagesDayGroups;
  message: string = '';
  autoScroller: MutationObserver;
  scrollOffset = 0;
  senderId: Number;
  loadingMessages: boolean;
  messagesBatchCounter: number = 0;
  messagesBatchWindow: number = 20;

  messages:Message[] = [];

  isPastEnd:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private el: ElementRef, 
              private chatService:ChatserviceProvider) {
    this.selectedChat = <Chat>navParams.get('chat');
    this.title = this.selectedChat.title;
    this.picture = this.selectedChat.picture;
    this.senderId = this.chatService.userID;

    this.chatService.recvMessages.subscribe((recvMsg) => {
      this.messages.push(recvMsg);

      this.updateMessages();
    });
  }

  private get messagesPageContent(): Element {
    return this.el.nativeElement.querySelector('.messages-page-content');
  }

  private get messagesList(): Element {
    return this.messagesPageContent.querySelector('.messages');
  }

  private get scroller(): Element {
    return this.messagesList.querySelector('.scroll-content');
  }

  ngOnInit() {

    this.autoScroller = this.autoScroll();
    this.subscribeMessages();

    Observable
        .fromEvent(this.scroller, 'scroll')
        .takeUntil(this.autoRemoveScrollListener())
        .filter(() => !this.scroller.scrollTop)
        .filter(() => !this.loadingMessages)
        // Invoke the messages subscription once all the requirements have been met
        .forEach(() => this.subscribeMessages());
  }

  ngOnDestroy() {
    this.autoScroller.disconnect();
  }

  // Subscribes to the relevant set of messages
  subscribeMessages(): void {
    // A flag which indicates if there's a subscription in process
    this.loadingMessages = true;
    // A custom offset to be used to re-adjust the scrolling position once
    // new dataset is fetched
    this.scrollOffset = this.scroller.scrollHeight;

    this.chatService.getMessages({
      senderid:this.senderId,
      page:this.messagesBatchCounter++,
      size:this.messagesBatchWindow
    }).subscribe(data => {

      if (data.length == 0) {
        this.isPastEnd = true;
        return;
      }
      //fill message[]
      data.forEach((item) => {
        const result = _.find(this.messages, (msg)=>msg._id == item.id.toString());
        if (result == undefined) {
            this.messages.unshift({
              _id:item.id.toString(),
              senderId: item.senderid.toString(),
              content: item.content,
              createdAt: new Date(item.createtime),
              type: MessageType.TEXT
            });
        }
      });
      this.updateMessages();
      this.loadingMessages = false;
    }
    );
  }

  updateMessages() {
    this.messagesDayGroups = this.findMessagesDayGroups();
  }

  findMessagesDayGroups() {
    return Observable.of(this.messages)
      .map((messages: Message[]) => {
        const format = 'Y MMMM D';

        // Compose missing data that we would like to show in the view
        messages.forEach((message) => {
          message.ownership = this.senderId.toString() == message.senderId ? 'mine' : 'other';

          return message;
        });

        // Group by creation day
        const groupedMessages = _.groupBy(messages, (message) => {
          return moment(message.createdAt).format(format);
        });

        // Transform dictionary into an array since Angular's view engine doesn't know how
        // to iterate through it
        return Object.keys(groupedMessages).map((timestamp: string) => {
          return {
            timestamp: timestamp,
            messages: groupedMessages[timestamp],
            today: moment().format(format) === timestamp
          };
        });
      });
  }

  //Removes the scroll listener once all messages from the past were fetched
  autoRemoveScrollListener<T>(): Observable<T> {
    return Observable.create((observer: Subscriber<T>) => {
      if (this.isPastEnd) {
        observer.next();
        observer.complete();
      }
    });
  }

  autoScroll(): MutationObserver {
    const autoScroller = new MutationObserver(this.scrollDown.bind(this));

    autoScroller.observe(this.messagesList, {
      childList: true,
      subtree: true
    });

    return autoScroller;
  }

  scrollDown(): void {
    // Don't scroll down if messages subscription is being loaded
    if (this.loadingMessages) {
      return;
    }

    // Scroll down and apply specified offset
    this.scroller.scrollTop = this.scroller.scrollHeight - this.scrollOffset;
    // Zero offset for next invocation
    this.scrollOffset = 0;
  }

  onInputKeypress({ keyCode }: KeyboardEvent): void {
    if (keyCode === 13) {
      this.sendTextMessage();
    }
  }

  sendTextMessage(): void {
    // If message was yet to be typed, abort
    if (!this.message) {
      return;
    }

    
    this.chatService.putMessage({
      senderid:this.senderId,
      content:this.message,
      destuserid:3
    }).subscribe((data)=> {
      this.messages.push({
          _id:data.id.toString(),
          senderId: data.senderid.toString(),
          content: data.content,
          createdAt: new Date(data.createtime),
          type: MessageType.TEXT
        });

      this.updateMessages();
    });
  }

}
