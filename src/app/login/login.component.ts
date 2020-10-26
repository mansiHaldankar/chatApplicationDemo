import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';

import { Output, EventEmitter, Input } from '@angular/core';

interface Room {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: string;
  room: string;
  rooms: Room[] = [
    {value: 'Room-1', viewValue: 'Room-1'},
    {value: 'Room-2', viewValue: 'Room-2'},
    {value: 'Room-3', viewValue: 'Room-3'}
  ];

  constructor( private chatService: ChatService,
               private router: Router ) { }

  ngOnInit(): void {
  }
  onJoinClickHandler(): void{
    // this._router.navigate(['/chatWindow', {user: this.user, room: this.room}]);
    this.chatService.joinRoom({user: this.user, room: this.room});
    this.router.navigate(['/chatWindow']);
 }

}
