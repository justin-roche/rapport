import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { customBot, gmailContact } from '../shared/custom-type-classes';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
//import { BOTS } from '../data/mock-bots';

@Injectable()
export class BotService {

  public userBots;
  public botTypes;
  public holidays;
  public contacts: Array<gmailContact>;
  public tasks: Array<string>;
  public scheduled = null;
  public recent = null;
  public currentBot = null;
  public deletedTasks = [];
  public allTasks;
  public token;
  public userId;
  private headers = {headers: new Headers({'Content-Type': 'application/json'})};

  private initialState = {
    selectedBot: null,
    activities: null,
    selectedTasks: null,
    availableContacts: null,
  }
  public state = new BehaviorSubject(this.initialState);
 
  constructor(private http: Http) {

  }

  //<----------------------BOT SELECT---------------------->

  public selectBot(bot){
    var _state = this.state.getValue();
    console.log(_state)
    _state.selectedBot = bot;
    _state.activities = bot.botActivity.recent;
    _state.selectedTasks = bot.tasks;
    if(_state.selectedBot.botType === 'social'){
      _state.availableContacts = bot.selectedFbFriends;
    } else {
      _state.availableContacts = bot.selectedContacts;
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

  

  //<----------------------CONTACT REMOVAL---------------------->

  public removeSelectedContact(contact){
    return this.http.delete(`/api/gmail/contacts?contactId=${contact.id}`).toPromise()
    .then(this.importUserBots.bind(this));
  }

  public removeSelectedFbContact(contact){
    return this.http.delete(`/api/facebook/friends?contactId=${contact.id}`).toPromise()
    .then(this.importUserBots.bind(this));
  }

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
  
 //<----------------------BOT API CALLS---------------------->

  private $getBots(){
    return this.http.get(`/api/bots?userId=${this.userId}`)
      .map(function(data: any) {
        return JSON.parse(data._body);
      })
      .toPromise()
  }

  private $postBots(){
    const body = JSON.stringify({bots: this.userBots});
    return this.http.put(`/api/bots?userId=${this.userId}`, body, this.headers)
    .toPromise()
  }

  private $deleteTasks(){
    const body = JSON.stringify({tasks: this.deletedTasks});
    return this.http.post('/api/tasks', body, this.headers)
    .toPromise();
  }

 
  //<----------------------DATA TRANSFORMATIONS FROM BACKEND TO FRONTEND---------------------->

  private botExtensions = {
    'basic': {
      deletedTasks: [], 
      potentialTasks: [],
      platform: 'gmail',
    },
    'social': {
      deletedTasks: [], 
      potentialTasks: [],
      platform: 'facebook',
    },
    'power': {
      deletedTasks: [], 
      potentialTasks: [],
      platform: 'facebook',
    }
  }

  private decorateAll(bots){
    var self = this;
    bots.forEach(function(bot){
      bot.decorated = JSON.parse(JSON.stringify(self.botExtensions[bot.botType]));
      self.addPotentialTasks(bot);
      self.extendTasks(bot.tasks);
    });
  }

  private extendTasks(tasks){
    var self = this;
    tasks.forEach(function(task){
      task.decorated = Object.assign({},self.taskExtensions[task.task]);
      self.markSubTask(task);
    });
  }

  private markSubTask(task){
    var self = this;
    if(task.date === null){
      task.decorated.subTask = false;
    }
    if(task.date !== null && task.decorated.subTask){
      task.decorated.masterTask = false;
      task.decorated.formattedName = self.holidays.filter((h)=>{
        return h.date === task.date
      })[0].name;
    }
  }

  private taskExtensions = {
    'sayHiGmail':           {formattedName: 'message on gmail',
                            setsDate: true, 
                            setsInterval: true,}, 
    'sayHappyBirthdayGmail':{formattedName: 'birthday wishes on gmail',
                            setsDate: false, 
                            setsInterval: false,},
    'sayHappyHolidayGmail': {formattedName: 'holiday on gmail', 
                            setsDate: false, 
                            setsInterval: false, 
                            masterTask: true,
                            holidays: true}, 
    'sayHiFacebook':        {formattedName: 'message on facebook',
                            setsDate: true, 
                            setsInterval: true,},
    'sayHappyBirthdayFacebook':{formattedName: 'birthday wishes on facebook',
                            setsDate: false, 
                            setsInterval: false,}, 
    'sayHappyHolidayFacebook': {formattedName: 'holiday on facebook', 
                            setsDate: false, 
                            setsInterval: false, 
                            subTask: true,
                            holidays: true}, 
  };

  private addPotentialTasks(bot){
    this.allTasks.forEach(function(_potentialTask){
      var potentialTask = JSON.parse(JSON.stringify(_potentialTask));
      var match = bot.tasks.some(function(botTask){
        return botTask.task === potentialTask.task;
      });
      if(!match && (bot.decorated.platform === potentialTask.platform)){
        bot.decorated.potentialTasks.push(potentialTask);
      }
    })
  }

  private joinScheduledTaskDescriptions(bots){
    var tasks = bots.reduce(function(acc,bot){
      return acc.concat(bot.botActivity.scheduled);
    },[]);
    return tasks;
  }

  private joinRecentTaskDescriptions(bots){
    var recent = bots.reduce(function(acc,bot){
      return acc.concat(bot.botActivity.recent)
    },[]);
    return recent;
  }


  //<----------------------DATA TRANSFORMATIONS FROM FRONTEND TO BACKEND---------------------->
  private normalizeDates(){
    this.userBots.forEach(function(bot){
      bot.selectedContacts.forEach(function(contact){
        if(contact.birthday){
          var date = new Date(contact.birthday);
          var month = date.getMonth();
          var day = date.getDay();
          contact.birthday = String(month) + '/' + String(day);
        }
      })
      bot.tasks.forEach(function(task){
        if(task.date && task.date !== 'today'){
          var date = new Date(task.date);
          var month = date.getMonth();
          var day = date.getDay();
          task.date = String(month) + '/' + String(day);
        }
      })
    })
  }

}

