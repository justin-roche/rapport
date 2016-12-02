import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { customBot, gmailContact } from '../shared/custom-type-classes';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
//import { BOTS } from '../data/mock-bots';

@Injectable()
export class BotActions {

  
 
  constructor(private http: Http) {

  }

  //<----------------------BOT SELECT---------------------->

  public selectBot(bot){
    var _state = this.state.getValue();

    //copy values from bot
    _state.selectedBot = bot;
    _state.activities = bot.botActivity.recent;
    _state.selectedTasks = bot.tasks;
    if(bot.botType === 'social'){
      _state.availableContacts = _state.
    }
    this.state.next(_state);
  }


  //<----------------------SETUP---------------------->

  public getInitialData(){
    //add get tasks when api endpoint is implemented
    return Promise.all([this.setUserVars(),this.getHolidays(), this.getAllTasks(), this.getBotTypes(), this.importUserBots()]);
  }

  private setUserVars(){
    return new Promise((resolve,reject)=>{
      this.token = localStorage.getItem('id_token');
      this.userId = localStorage.getItem('user_id');
      resolve();
    });
  }

  private getHolidays(){
    var d = new Date();
    return this.http.get(`/api/holidays?year=${d.getFullYear()}`)
      .toPromise()
      .then((data) => {
        this.holidays = data.json();
      });
  }

  private getAllTasks(){
      return this.http.get('/api/tasks')
      .toPromise()
      .then((data)=>{
        this.allTasks = data.json();
        this.extendTasks(this.allTasks);
      });
  }

  private getBotTypes(){
    return this.http.get(`/api/botTypes`)
      .map((data: any)=>{
          this.botTypes = JSON.parse(data._body).bots;
          //decoration step
          this.decorateAll(this.botTypes);
          return this.botTypes;
      })
      .toPromise();
  }

  public importUserBots(){
      this.$getBots()
      .then((bots)=>{
        if(bots.length !== 0) {
          this.userBots = bots;

          //decoration step
          this.decorateAll(this.userBots);
          this.scheduled = this.joinScheduledTaskDescriptions(this.userBots);
          this.recent = this.joinRecentTaskDescriptions(this.userBots);
          return this.userBots;
        } else {
          this.userBots = [];
          this.scheduled = [];
      }
    });
  }

 //<----------------------BOT STATE CHANGES---------------------->


  //public methods should not return anything
  public updateBots(userBotsArray){
    //undecoration step
    this.normalizeDates();

    return this.$deleteTasks()
    .then(()=>{
      this.deletedTasks = [];
    })
    .then(this.$postBots.bind(this))
    .then(this.importUserBots.bind(this))

  }

  //selectedBot should exist on store
  public retireBot(selectedBot){
    return this.http.delete(`/api/bots?botId=${selectedBot.id}`)
    .toPromise()
    .then(this.importUserBots.bind(this))
  }

  public sendNow(){
    return this.http.get('/api/runalltasks').toPromise();
  }

  public addBotTypeToUser(bot: any){
    this.userBots.push(bot);
  }

  public actions(name,payload){
    //deep copy state here
    //loses reference to the object you are trying to change?
    switch(name){
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
  

  //<----------------------CONTACT REMOVAL---------------------->

  

  //<----------------------TASK ADDITION---------------------->

  public addNewHolidayTask(taskOptions,bot){
    var date = this.holidays.filter(function(holiday){
      return holiday.name === taskOptions.name;
    })[0].date;

    var task = {id: null,
                id_bot: null,
                interval: 12,
                date: date,
                message: taskOptions.message,
                task: 'sayHappyHolidayGmail',
                platform: 'gmail',
                decorated: {
                            formattedName: taskOptions.name,
                            setsInterval: false,
                            setsDate: false,
                            subTask: true}
                };

    bot.tasks.push(task);
  }
  
 

 
  

