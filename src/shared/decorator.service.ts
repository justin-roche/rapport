import { Injectable } from '@angular/core';
import { Store } from '../shared/store';

@Injectable()
export class DecoratorService {
  private holidays; 
  private allTasks; 

  constructor(private store: Store) {
    store.state.subscribe((nextState)=>{
      this.holidays = nextState.tasks.holidays; 
      this.allTasks = nextState.tasks.allTasks; 
    });
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

  public decorateBots(bots){
    bots.forEach((bot)=>{
      bot.decorated = JSON.parse(JSON.stringify(this.botExtensions[bot.botType]));
      this.addPotentialTasks(bot);
      this.decorateTasks(bot.tasks);
    });
  }

//<----------------------ADDING POTENTIAL TASKS


  public addPotentialTasks(bot){
    this.allTasks.forEach((_potentialTask)=>{
      var potentialTask = JSON.parse(JSON.stringify(_potentialTask));
      if(!this.botHasTask(bot,potentialTask) && (bot.decorated.platform === potentialTask.platform)){
        bot.decorated.potentialTasks.push(potentialTask);
      }
    })
  }

  private botHasTask(bot,potentialTask){
    return bot.tasks.some(function(botTask){
      return botTask.task === potentialTask.task;
    });
  }

//<----------------------EXTENDING TASKS

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

  public decorateTasks(tasks){
    tasks.forEach((task)=>{
      task.decorated = Object.assign({},this.taskExtensions[task.task]);
      this.markMasterTask(task);
      this.markSubTask(task);
      this.assignHolidayNames(task);
    });
  }

  //todo: refactor to do single iteration of tasks array
  private markMasterTask(task){
    if(task.date === null){
      task.decorated.subTask = false;
    }
  }

  private markSubTask(task){
    if(task.decorated.subTask){
      task.decorated.masterTask = false;
    }
  }

  private assignHolidayNames(task){
    if(task.name === 'sayHappyHolidayFacebook' || task.name === 'sayHappyHolidayGmail'){
      if(task.date){
        task.decorated.formattedName = this.nameFromHolidayDate(task.date);
      }
    }
  }

  private nameFromHolidayDate(date){
    return this.holidays.filter((h)=>{
      return h.date === date
    })[0].name
  }

  //<----------------------AGGREGATING RECENT/SCHEDULED TASKS

  public aggregateScheduled(bots){
    return bots.reduce(function(acc,bot){
      return acc.concat(bot.botActivity.scheduled);
    },[]);
  }

  public aggregateRecent(bots){
    return bots.reduce(function(acc,bot){
      return acc.concat(bot.botActivity.recent)
    },[]);
  }

  //<----------------------DATA TRANSFORMATIONS FROM FRONTEND TO BACKEND---------------------->
  public normalizeDates(bots){
    bots.forEach(function(bot){
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

   //<----------------------TASK ADDITION---------------------->

  public addNewHolidayTask(taskOptions,bot){
    // var date = this.holidays.filter(function(holiday){
    //   return holiday.name === taskOptions.name;
    // })[0].date;

    // var task = {id: null,
    //             id_bot: null,
    //             interval: 12,
    //             date: date,
    //             message: taskOptions.message,
    //             task: 'sayHappyHolidayGmail',
    //             platform: 'gmail',
    //             decorated: {
    //                         formattedName: taskOptions.name,
    //                         setsInterval: false,
    //                         setsDate: false,
    //                         subTask: true}
    //             };

    // bot.tasks.push(task);
  }


  

}

