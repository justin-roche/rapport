
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { customBot, gmailContact } from '../shared/custom-type-classes';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class TaskActions {

  private getHolidays(){
    var d = new Date();
    return this.http.get(`/api/holidays?year=${d.getFullYear()}`)
      .toPromise()
      .then((data) => {
        this.holidays = data.json();
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

}