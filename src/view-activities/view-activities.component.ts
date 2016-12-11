import { Component, ViewChild } from '@angular/core';
import { customBot, gmailContact } from '../shared/custom-type-classes';
import { Store } from '../shared/store';


@Component({
  selector: 'ActivitiesContainer',
  templateUrl: 'app/view-activities/view-activities.component.html',
  styleUrls: ['app/view-activities/view-activities.component.css']
})

export class ActivitiesContainer {

  @ViewChild('myModal')

  title = 'My Bots';

  private allScheduled;
  private allRecent;
  private bots: Array<customBot>;

  private subscribedScheduled;
  private subscribedRecent;

  constructor(private store: Store){
     store.state.subscribe((nextState)=>{
      this.subscribedRecent = nextState.log.recent;
      this.subscribedScheduled = nextState.log.scheduled;
    });
  }

  botFilter(arrayOfTasks, bot) {
    return arrayOfTasks.filter(task => {
      if(task.botName !== 'MyBot'){
        return task.botName === bot.botName;
      } else {
        return task.botType === bot.botType;
      }
    });
  }

  filterByBot(bot) {
    this.subscribedRecent = this.botFilter(this.allRecent, bot);
    this.subscribedScheduled = this.botFilter(this.allScheduled, bot);
  }
}
