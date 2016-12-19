import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Injectable }      from '@angular/core';

@Injectable()
export class Store {

<<<<<<< HEAD
   private initialState = {
    userData: {
      token: null,
      id: null,
      authenticated: null,
    },
    bots: {
      userBots: null,
      selectedBot: null,
    },
    contacts: {
      availableGmailContacts: null,
      availableFbContacts: null,
      availableContacts: null,
      selectedContact: null,
      removedContact: null,
    },
    tasks: {
      deletedTasks: null,
      selectedTasks: null,
      recentActivities: null,
      scheduledActivities: null,
=======
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
      selectedBotIndex: null,
      userBots: [],
    },
    log: {
      recent: null,
      scheduled: null,
    },
    tasks: {
      editableTask: null,
      selectedTask: null,
      holidays: null,
      allTasks: null,
    },
    setupView: {
      selectedType: null,
    },
    manageView: {
      // availableContacts: null,
      // selectedContacts: null,
>>>>>>> cleanup
    }
  }

  public state = new BehaviorSubject(this.initialState);
<<<<<<< HEAD
=======
  state$ = this.state.asObservable();
  private _state; 
  private userId;
>>>>>>> cleanup

  constructor(){

  }

<<<<<<< HEAD
  public setState(_state){
      this.state.next(_state);
=======
  public trigger(){
    var state = this.state.getValue();
    this.state.next(state);
>>>>>>> cleanup
  }

}