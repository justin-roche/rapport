import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Injectable }      from '@angular/core';
import { GmailService } from '../shared/gmail.service';
import { BotService } from '../shared/bot.service';

@Injectable()
export class Store {

  private initialState = {
    appUserInfo: null,
    bots: {
      selectedBot: null,
      userBots: null,
    } 
  }
    public state = new BehaviorSubject(this.initialState);
    state$ = this.state.asObservable();
    private _state; 
    private userId;

    public trigger(){
      var state = this.state.getValue();
      this.state.next(state);
    }

    

  public dispatch(type,payload){
    var state = this.state.getValue();
    switch(type){
      case 'SET':
        for(var prop in payload){
          state[prop] = payload[prop];
        }
        this.state.next(state);
        break;
      case 'DELETE-TASK': 
        payload.bot.tasks = payload.bot.tasks.filter(function(task){
          return task !== payload.task;
        });
        this.botService.deletedTasks.push(payload.task.id);
        if(!payload.task.decorated.subTask){
          payload.bot.decorated.potentialTasks.push(payload.task); 
        }
        //will cause mastertasks with a date to render incorrectly
        //assign copied state to next observable
        this.trigger();
        break;
      case 'ADD-TASK': 
        payload.bot.tasks.push(payload.task);
        payload.bot.decorated.potentialTasks = payload.bot.decorated.potentialTasks.filter(function(task){
          return task !== payload.task;
        });
        this.botService.deletedTasks = this.botService.deletedTasks.map(function(task){
          return task.id !== payload.task.id;
        })
        this.trigger();
        break;
      default: 
        alert('unhandled action');
    }

  }

}