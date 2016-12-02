import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Injectable }      from '@angular/core';
import { GmailService } from '../shared/gmail.service';
import { BotService } from '../shared/bot.service';
import { Store } from '../shared/store';
import { Router } from '@angular/router';

@Injectable()
export class Reducers {


constructor(private router: Router, private botService: BotService, private store: Store){
  this.dispatch = this.dispatch.bind(this);
}

public dispatch(type,payload){
    var state = this.store.state.getValue();
    switch(type){
      case 'SET':
        for(var prop in payload){
          state[prop] = payload[prop];
        }
        break;
      case 'SET-USER-BOTS':
        state.bots.userBots = payload.userBots;
      case 'DELETE-TASK': 
        payload.bot.tasks = payload.bot.tasks.filter(function(task){
          return task !== payload.task;
        });
        this.botService.deletedTasks.push(payload.task.id);
        if(!payload.task.decorated.subTask){
          payload.bot.decorated.potentialTasks.push(payload.task); 
        }
        break;
      case 'ADD-TASK': 
        payload.bot.tasks.push(payload.task);
        payload.bot.decorated.potentialTasks = payload.bot.decorated.potentialTasks.filter(function(task){
          return task !== payload.task;
        });
        this.botService.deletedTasks = this.botService.deletedTasks.map(function(task){
          return task.id !== payload.task.id;
        })
        break;
      case 'ROUTE':
        var userObj = this.store.state.getValue().appUserInfo;
        var userBots = this.store.state.getValue().bots.userBots;
        if(userObj.newUser || userBots.length===0){
          this.router.navigate(['setup']);
        } else {
          this.router.navigate(['manage']);
        }
        break;
      default: 
        alert('unhandled action');
    }
    this.store.state.next(state);

  }

}