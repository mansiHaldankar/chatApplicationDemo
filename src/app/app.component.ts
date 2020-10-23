import { ChatService } from './chat.service';
import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'chatApplicationDemo';

  userName: string;
  room: string;

  constructor( private chatService: ChatService ){}

  ngOnInit(): void {
    this.chatService.chatSubject.subscribe(data => {
      this.userName = data.user;
      this.room = data.room;
    });
  }


}
