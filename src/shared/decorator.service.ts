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

// the model of API-client interaction is that the objects are decorated on the client side, e.g. modified for display. 
// The modifications for each bot exist in the .decorated property

//todo: centralize botExtensions and botTypes as used on the server so they can be shared and tested together

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

  //prepare bot objects for disaply
  public decorateBots(bots){
    bots.forEach((bot)=>{
      bot.decorated = JSON.parse(JSON.stringify(this.botExtensions[bot.botType]));
      this.addContactsProperties(bot);
      this.addPotentialTasks(bot);
      this.decorateTasks(bot.tasks);
    });
  }

  //prepare for sending back to the server
  public undecorateBots(bots){
    bots.forEach((bot)=>{
      this.normalizeDates(bot);
      this.transferContacts(bot);
    });
  }

//<----------------------ADDING POTENTIAL TASKS

//todo: consistent use of "friends" vs. "contacts" for everything

public addContactsProperties(bot){
     if(bot.decorated.platform === 'gmail'){
        bot.decorated.availableContacts = this.store.state.getValue().user.gmailContacts;
        bot.decorated.selectedContacts = bot.selectedContacts; 
      } else {
        bot.decorated.availableContacts = this.store.state.getValue().user.fbContacts;
        bot.decorated.selectedContacts = bot.selectedFbFriends; 
     }
}

//<----------------------ADDING POTENTIAL TASKS

//the api sends all possible tasks with a single call, they must be filtered for platform before being added as potential 
//tasks for a bot

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

//tasks are decorated similarly with any missing information needed for display

//todo: factor into separate file

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

 //to mark subtasks they are checked for date and type properties
 
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

  //<----------------------CHOOSING AVAILABLECONTACT TYPE

  public filterGmailContacts(contacts){
    return contacts.filter(contact=>{
      return contact.name != "";
    })
  }

  // public setSelectedContacts(bot){
  
  // }

  //<----------------------ADDING AND REMOVING CONTACTS TO AVAILABLE AND SELECTED CONTACTS

  public addToSelectedContacts(bot, contact){
      bot.decorated.selectedContacts.push(contact);
  }

  public removeFromSelectedContacts(bot, contact){
    var i = bot.decorated.selectedContacts.indexOf(contact);
    bot.decorated.selectedContacts.splice(i,1);
  }

  public removeFromAvailableContacts(bot, removed){
    bot.decorated.availableContacts = bot.decorated.availableContacts.filter(contact=>{
      return contact !== removed; 
    });
  }

  public addToAvailableContacts(bot, added){
    bot.decorated.availableContacts = bot.decorated.availableContacts.concat(added);
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

  public transferContacts(bots){
    bots.forEach(function(bot){
      if(bot.decorated.platform === 'gmail'){
        bot.selectedContacts = bot.decorated.selectedContacts;
      } else {
        bot.selectedFbFriends = bot.decorated.selectedContacts; 
      }
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

