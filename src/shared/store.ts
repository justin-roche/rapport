import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Injectable }      from '@angular/core';
import { GmailService } from '../shared/gmail.service';

@Injectable()
export class Store {

  private initialState = {
    appUserInfo: null,
    bots: {
      selectedBot: null,
      userBots: [],
    } 
  }

  public state = new BehaviorSubject(this.initialState);
  state$ = this.state.asObservable();
  private _state; 
  private userId;

  constructor(){

  }

  public trigger(){
    var state = this.state.getValue();
    this.state.next(state);
  }

}