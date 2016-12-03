import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Injectable }      from '@angular/core';
import { GmailService } from '../shared/gmail.service';

@Injectable()
export class Store {

  private initialState = {
    user: {
      authResult: null,
      appUserInfo: null,
      token: null,
    },
    bots: {
      botTypes: null,
      selectedBot: null,
      userBots: [],
    },
    tasks: {
      holidays: null,
      allTasks: null,
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