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
  messageArray: Array<{user: string, message: string,}> = [];
  chatSubscription: Subscription;
  loggedInUsers: any = [];
  userObj: any = {};

  constructor( private chatService: ChatService ) {
    this.chatSubscription = this.chatService.newUserJoined().subscribe(data => {
      console.log(data);
      this.messageArray.push(data);
    });

    this.chatSubscription = this.chatService.getUserDetails().subscribe(data => {
      console.log(data);
      this.userObj = data;
    });

    this.chatSubscription = this.chatService.newMessageReceived().subscribe(data => {
      console.log(data);
      this.messageArray.push(data);
      // tslint:disable-next-line: forin
      for (let iMsg in this.messageArray) {
        this.messageArray[iMsg]['type'] = "I";
        if(this.messageArray[iMsg].user.trim() !== this.userObj.user.trim()) {
          this.messageArray[iMsg]['type'] = 'O';
        }
      }
      console.log(this.messageArray);
    });

    this.chatSubscription = this.chatService.userLeftRoom().subscribe(data => {
      console.log(data);
      this.messageArray.push(data);
    });
  }


  ngOnInit(): void {

  }


  onLeaveClickHandler(): void{
    this.user = document.querySelector('span.logged-in-user').innerHTML;
    this.room = document.querySelector('span.logged-in-room').innerHTML;
    this.chatService.leaveRoom({user: this.user.trim(), room: this.room.trim()});
  }

  onSendMsgClickHandler(): void{
    this.user = document.querySelector('span.logged-in-user').innerHTML;
    this.room = document.querySelector('span.logged-in-room').innerHTML;
    this.chatService.sendMessage({user: this.user.trim(), room: this.room.trim(), message: this.inputMessage});
    this.inputMessage = "";
  }



ngOnDestroy(): void {
    this.chatSubscription.unsubscribe();
  }

}
