
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatSubject = new Subject<any>();

  // tslint:disable-next-line: variable-name
  constructor( private _router: Router  ) { }

  private socket = io('http://localhost:3000');

  joinRoom(data): void{
    this.chatSubject.next(data);
    this.socket.emit('join', data);
  }

  newUserJoined(){
    const observable = new Observable<{user: string, room: string,  message: string}>(observer => {
      this.socket.on('newUserJoined', (data) => {
          observer.next(data);
      });

      return () => {this.socket.disconnect();}
  });

    return observable;
  }

  leaveRoom(data): void{
    this.socket.emit('leave', data);
  }

  userLeftRoom(){
    const observable = new Observable<{user: string, room: string, message: string}>(observer => {
      this.socket.on('leftRoom', (data) => {
          observer.next(data);
      });

      return () => {this.socket.disconnect();}
    });
    return observable;
  }

  sendMessage(data){
    this.socket.emit('message', data);
  }

  newMessageReceived(){
    let observable = new Observable<{user:string, message:string}>(observer=>{
      this.socket.on('newMsg', (data)=>{
          observer.next(data);
      });
      return () => {this.socket.disconnect()};
  });

  return observable;
  }

}
