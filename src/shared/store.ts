import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Injectable }      from '@angular/core';
import { GmailService } from '../shared/gmail.service';
import { BotService } from '../shared/bot.service';

@Injectable()
export class Store {

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
    }
  }

  public state = new BehaviorSubject(this.initialState);

  constructor(){

  }

  public setState(_state){
      this.state.next(_state);
  }

}