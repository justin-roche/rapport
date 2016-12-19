import { Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContactComponent } from '../contact/contact.component';
import { AvailableContactsComponent } from '../available/available.component';
import { SearchTasksComponent } from '../search-tasks/search-tasks.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';
import { DecoratorService } from '../shared/decorator.service';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'manage-component',
  templateUrl: 'app/manage/manage.component.html',
  styleUrls: ['app/manage/manage.component.css']
})

export class ManageComponent {

  title = 'My Bots';

<<<<<<< HEAD
  private bots: Array<customBot>;
  private selectedBot: customBot;
  private selectedTask;
  private subTask;
  private displayMessage;
  private customMessage;
  private customInterval;
  private customDate;
  private activities: Array<string>;
  private contacts: Array<gmailContact>;
  private tasks: Array<string>;
  private mode = "bot";
  private scheduled;
  private editabelName;
  private customBotName;
  private recent; 
  private uiVars = {newContact:{name: "", string: ""},
                    editContact: "",
                    success: false,
                    };
  //
  constructor(private botService: BotService,
              private gmailService: GmailService,
              private router: Router,
              private store: Store) {

   var self = this;
   botService.state.subscribe(function(state){
     console.log(state);
   })


  }

   //<-------------------DISPLAY MODE------------------->
  pageMode(mode){
    this.mode = mode;
  }

  //<-------------------TASK METHODS------------------->
  close() {
    this.modal.close();
    this.selectedTask = null;
  }

  saveTask(){
    if(this.selectedTask.task === 'sayHappyHolidayGmail'){
      var opts = {name: this.subTask, message: this.customMessage};
      this.botService.addNewHolidayTask(opts, this.selectedBot);
    } else {
      this.customMessage? this.selectedTask.message = this.customMessage: 1;
      this.customInterval? this.selectedTask.interval = this.customInterval: 1;
      this.customDate? this.selectedTask.date = this.customDate: 1;
    }
    this.reload();
    this.tasks = this.selectedBot.tasks;
  }

  open(task) {
    this.selectedTask = task;
    this.customMessage = this.selectedTask.message;
    this.customInterval = this.selectedTask.interval;
    this.customDate = this.selectedTask.date;
    this.modal.open();
=======
  private uiVars = {};
  
  constructor(private router: Router,private store: Store, private reducers: Reducers, private decorators: DecoratorService, private apiService: ApiService) {
    store.state.subscribe((nextState)=>{
      if(nextState.bots.userBots.length === 0){
        this.router.navigate(['setup']);
      }
      if(nextState.bots.userBots.length >0 && !nextState.bots.selectedBot) {
        this.reducers.dispatch('SET-SELECTED-BOT', nextState.bots.userBots[0]);
      }
    });
>>>>>>> cleanup
  }

  private submitAllSettings(): void{


<<<<<<< HEAD
  private onSelectBot(bot: any): void {
    this.botService.selectBot(bot);
  }

  private submitAllSettings(): void{
    var self = this;
    this.botService.updateBots(this.bots).then(_=>{
      this.reload();
      if(!this.selectedBot.id){
        this.selectedBot = this.bots[this.bots.length-1];
      }
      this.showSuccess(); 
=======

    var bots = JSON.parse(JSON.stringify(this.store.state.getValue().bots.userBots)); 
    this.decorators.undecorateBots(bots);
    var deletedTasks = this.decorators.aggregateDeletedTasks(bots);
    if(deletedTasks.length>0){
      this.apiService.deleteTasks(deletedTasks)
    }
    this.apiService.postBots(bots)
    .then(this.apiService.getBots.bind(this.apiService))
    .then(function(){
      //show success
>>>>>>> cleanup
    })
    
  }

  private retireBot(): void {
      var bot = this.store.state.getValue().bots.selectedBot;
      this.apiService.deleteBot(bot)
      .then(this.apiService.getBots.bind(this.apiService))
      .then(function(){
        //show success
      })
  }

  private sendNow(): void {
    this.apiService.sendNow();
  }

  // private showSuccess(){
  //   var self = this;
  //   this.uiVars.success = true;
  //   setTimeout(function(){
  //     self.uiVars.success = false;
  //   },1000);
  // }

  ngOnInit(){
    
  }

}
