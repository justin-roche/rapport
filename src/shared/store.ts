import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Injectable }      from '@angular/core';

@Injectable()
export class Store {

  private initialState = {
    user: {
      authResult: null,
      appUserInfo: null,
      token: null,
      gmailContacts: null,
      fbContacts: null,
    },
    bots: {
      botTypes: null,
      selectedBot: null,
      userBots: [],
    },
    log: {
      recent: null,
      scheduled: null,
    },
    tasks: {
      holidays: null,
      allTasks: null,
    },
    setupView: {
      selectedType: null,
    },
    manageView: {
      availableContacts: null,
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