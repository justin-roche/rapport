import { Component, ViewChild } from '@angular/core';
import { customBot, gmailContact } from '../shared/custom-type-classes';
import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  selector: 'task-modal-component',
  templateUrl: 'app/task-modal/task-modal.component.html',
  styleUrls: ['app/task-modal/task-modal.component.css']
})

export class TaskModalComponent {

   @ViewChild('myModal')
   modal: ModalComponent;

  private uiVars = {modal: false, customMessage: null, customInterval: null, customDate: null, subTask: null};

  constructor(private store: Store, private reducers: Reducers) {
    store.state.subscribe((nextState)=>{
      if(nextState.tasks.editableTask && !this.uiVars.modal){
        this.modal.open();
        this.uiVars.modal = true; 

        if(!this.uiVars.customMessage) this.uiVars.customMessage = nextState.tasks.editableTask.message;
        if(!this.uiVars.customInterval) this.uiVars.customInterval = nextState.tasks.editableTask.interval;
        if(!this.uiVars.customDate) this.uiVars.customDate = nextState.tasks.editableTask.date;
      }
    });
  }

  private close(){
    this.uiVars.modal = false;
    this.modal.close();
    this.uiVars.customDate = null;
    this.uiVars.customInterval = null;
    this.uiVars.customMessage = "";
    this.reducers.dispatch('EDIT-SELECTED-TASK',null);
  }

  // private canSetDate(){
  //   return this.selectedTask && this.selectedTask.task !== 'sayHappyBirthdayGmail';
  // }

  save(){
    var opts;
    if(this.store.state.getValue().tasks.selectedTask.decorated.holidays){
      opts = {name: this.uiVars.subTask, message: this.uiVars.customMessage};
      this.reducers.dispatch('ADD-HOLIDAY-TASK', opts);
    } else {
      opts = {message: this.uiVars.customMessage, interval: this.uiVars.customInterval, date: this.uiVars.customDate};
      this.reducers.dispatch('EDIT-TASK', opts);
   }
   this.close();
   
  }

  
}