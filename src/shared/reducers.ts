import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Injectable }      from '@angular/core';
import { Store } from '../shared/store';
import { Router } from '@angular/router';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { DecoratorService } from '../shared/decorator.service';

@Injectable()
export class Reducers {


constructor(private decorators: DecoratorService, private store: Store){
  this.dispatch = this.dispatch.bind(this);
}

public dispatch(type,payload){

    //use getValue to unwrap the currentState
    var state = Object.assign({},this.store.state.getValue());
    
    switch(type){
      
      case 'SET-USER-VARS':
        state.user.token = localStorage.getItem('id_token');
        state.user.token = localStorage.getItem('user_id');
        break;

      case 'SET-AUTH-RESULT':
        state.user.authResult = payload;
        break;

      case 'SET-USER-INFO':
        state.user.appUserInfo = payload;
        break;

      case 'SET-HOLIDAYS':
        state.tasks.holidays = payload; 
        //decorate
        break;

      case 'SET-ALL-TASKS':
        state.tasks.allTasks = payload; 
        this.decorators.decorateTasks(state.tasks.allTasks);
        break;

      case 'ADD-NEW-BOT': 
        state.bots.userBots.push(payload);
        break;

      case 'SET-BOT-TYPES': 
        state.bots.botTypes = payload.bots; 
        this.decorators.decorateBots(state.bots.botTypes);
        break;

      case 'SET-SELECTED-TYPE':
        state.setupView.selectedType = payload;
        break;

      case 'SET-SELECTED-BOT':
        state.bots.selectedBot = payload;
        //state.manageView.availableContacts = this.decorators.chooseAvailableContacts(state.bots.selectedBot);
        //state.manageView.selectedContacts = this.decorators.chooseSelectedContacts(state.bots.selectedBot);
        break;

      case 'SET-BOTS': 
        state.bots.userBots = payload; 
        this.decorators.decorateBots(state.bots.userBots);
        state.log.recent = this.decorators.aggregateRecent(state.bots.userBots)
        state.log.scheduled = this.decorators.aggregateScheduled(state.bots.userBots)
        break;

      case 'SET-GMAIL-CONTACTS': 
        state.user.gmailContacts = this.decorators.filterGmailContacts(payload); 
        break;

      case 'SET-FB-CONTACTS': 
        state.user.fbContacts = payload; 
        break;

      case 'SET-FB-CREDENTIALS': 
        state.user.appUserInfo.fbCredentials = true; 
        break;

      case 'ADD-NEW-BOT': 
        state.bots.userBots.push(payload);
      
      case 'SET-USER-BOTS':
        state.bots.userBots = payload.userBots;
        break;

      case 'ADD-SELECTED-CONTACT':
        this.decorators.addToSelectedContacts(state.bots.selectedBot, payload);
        this.decorators.removeFromAvailableContacts(state.bots.selectedBot, payload);
        break;

      case 'REMOVE-SELECTED-CONTACT':
        this.decorators.removeFromSelectedContacts(state.bots.selectedBot, payload);
        this.decorators.addToAvailableContacts(state.bots.selectedBot, payload);
        break;

      case 'EDIT-SELECTED-TASK':
        state.tasks.editableTask = payload;
        break;

      case 'ADD-TASK': 
        // payload.bot.tasks.push(payload.task);
        // payload.bot.decorated.potentialTasks = payload.bot.decorated.potentialTasks.filter(function(task){
        //   return task !== payload.task;
        // });
        // this.botService.deletedTasks = this.botService.deletedTasks.map(function(task){
        //   return task.id !== payload.task.id;
        // })
        // break;
        
      case 'DELETE-TASK': 
        //implement
        break;

      default: 
        alert('unhandled action');
    }
    this.store.state.next(state);
    return this.store.state.asObservable().toPromise();
  }

}