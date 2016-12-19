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
  }

  private submitAllSettings(): void{
    
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
