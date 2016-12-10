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

  private uiVars = {modal: false,
                    };

  constructor(private store: Store, private reducers: Reducers) {
    store.state.subscribe((nextState)=>{
      if(nextState.tasks.editableTask && !this.uiVars.modal){
        this.modal.open();
        this.uiVars.modal = true; 
      }
    });
  }

  private close(){
    this.uiVars.modal = false;
    this.modal.close();
    this.reducers.dispatch('EDIT-SELECTED-TASK',null);
  }

  
}