import { ChatService } from './../chat.service';

import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit, OnDestroy  {

  user: string;
  room: string;
  inputMessage: string;
  messageArray: any = [];
  chatSubscription: Subscription;
  loggedInUsers: any = [];
  userObj: any = {};
  horizontalPos: MatSnackBarHorizontalPosition = 'right';
  verticalPos: MatSnackBarVerticalPosition = 'bottom';

  constructor( private chatService: ChatService, private router: Router, private snackBar: MatSnackBar ) {

    this.chatSubscription = this.chatService.newUserJoined().subscribe(data => {
      console.log(data);
      this.messageArray.push(data);
      this.getMsgType(this.messageArray);
      this.openToastMessage('U', data);
    });

    this.chatSubscription = this.chatService.getUserDetails().subscribe(data => {
      console.log(data);
      this.userObj = data;
    });

    this.chatSubscription = this.chatService.newMessageReceived().subscribe(data => {
      console.log(data);
      this.messageArray.push(data);
      this.getMsgType(this.messageArray);
    });
    this.chatSubscription = this.chatService.newMessageReceivedNotification().subscribe(data => {
      console.log(data);
      this.openToastMessage('M', data);
    });

    this.chatSubscription = this.chatService.userLeftRoom().subscribe(data => {
      this.messageArray.push(data);
      this.getMsgType(this.messageArray);
    });
  }

  ngOnInit(): void {

  }
// tslint:disable-next-line: typedef
  getMsgType(messageArray){
    // tslint:disable-next-line: forin
    for (const iMsg in this.messageArray) {
      this.messageArray[iMsg].type = 'O';
      if (this.messageArray[iMsg].user.trim() !== this.userObj.user.trim()) {
        this.messageArray[iMsg].type = 'I';
      }
    }
  }

  onLeaveClickHandler(): void{
    this.chatService.leaveRoom({user: this.userObj.user, room: this.userObj.room});
    this.router.navigate(['/']);

  }

  onSendMsgClickHandler(): void{
    this.chatService.sendMessage({user: this.userObj.user, room: this.userObj.room, message: this.inputMessage});
    this.inputMessage = '';
  }

  openToastMessage(evtType,  data): void {
    let message;
    if (evtType === 'U') {
      message = data.user + ' has joined ' + data.room;
    } else if (evtType === 'M'){
      message = 'Message Received from ' + data.user;
    }

    this.snackBar.open(message, 'Dismiss', {
      duration: 300000,
      horizontalPosition: this.horizontalPos,
      verticalPosition: this.verticalPos,
      panelClass: 'notif-success'
    });
  }

ngOnDestroy(): void {
    this.chatSubscription.unsubscribe();
  }

}
