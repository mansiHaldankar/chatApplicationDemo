import { ActivatedRoute } from '@angular/router';
import { ChatService } from './../chat.service';
import { AfterViewChecked, AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit, OnDestroy  {

  user: string;
  room: string;
  inputMessage: string;
  messageArray: Array<{user: string, message: string}> = [];
  chatSubscription: Subscription;
  currentUserData: any;


  constructor( private chatService: ChatService, private _activatedRoute: ActivatedRoute ) {
    // this._activatedRoute.params.subscribe(data => {
    //   debugger;
    //   this.chatService.joinRoom(data);
    // });
    this.chatSubscription = this.chatService.newUserJoined().subscribe(data => {
      console.log(data);
      this.messageArray.push(data);
    });

    this.chatSubscription = this.chatService.newMessageReceived().subscribe(data => {
      console.log(data);
      this.messageArray.push(data);
    });

    this.chatSubscription = this.chatService.userLeftRoom().subscribe(data => {
      console.log(data);
      this.messageArray.push(data);
    });
  }


  ngOnInit(): void {}


  onLeaveClickHandler(): void{
    this.user = document.querySelector('span.logged-in-user').innerHTML;
    this.room = document.querySelector('span.logged-in-room').innerHTML;
    this.chatService.leaveRoom({user: this.user.trim(), room: this.room.trim()});
  }

  onSendMsgClickHandler(): void{
    this.user = document.querySelector('span.logged-in-user').innerHTML;
    this.room = document.querySelector('span.logged-in-room').innerHTML;
    this.chatService.sendMessage({user: this.user.trim(), room: this.room.trim(), message: this.inputMessage});
  }

  ngOnDestroy(): void {
    this.chatSubscription.unsubscribe();
  }

}
