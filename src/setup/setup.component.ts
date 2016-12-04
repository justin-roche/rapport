import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { Store } from '../shared/store';
import {FbService} from '../shared/fb.service';

@Component({
  moduleId: module.id,
  selector: 'setup-component',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.css']
})

export class SetupComponent {

  private fbUsername: String;
  private fbPassword: String;
  private uiVars = {
    invalid: false,
    loading: false,
  }
  bots = [];
  selectedType;

  // @ViewChild('myModal')
  // modal: ModalComponent;

  // close() {
  //     this.fbUsername = "";
  //     this.fbPassword = "";
  //     this.modal.close();
  // }

  // open() {
  //     this.modal.open();
  // }

  // @ViewChild('powerModal')
  // powerModal: ModalComponent;

  // closePower() {
  //     this.powerModal.close();
  // }

  // openPower() {
  //     this.powerModal.open();
  // }

  constructor(private fbService: FbService, private store: Store){
    this.bots = store.state.getValue().bots.botTypes;
    console.log('bots assigned')
    store.state.subscribe((nextState)=>{
      console.log('bots received');
      this.bots = nextState.bots.botTypes; 
    });
  }

  // private handleClick(selectedType){
  //   this.selectedType = selectedType;

  //   //if the fbService has no contacts, get the users fb auth info
  //   if(selectedType.botType === 'social' && !this.store.state.getValue().user.fbContacts){
  //     this.open();
  //   } else if(selectedType.botType === 'power'){
  //     this.openPower();
  //   } else {
  //     this.routeToManage(selectedType);
  //   }
  // }

  // private fbLogin(){
  //   var self = this;
  //   this.uiVars.loading = true;
  //   this.apiService.getFbContacts(this.fbUsername, this.fbPassword).then(()=>{
  //       this.routeToManage(this.selectedType);
  //   })
  //   .catch(()=>{
  //     this.fbPassword = "";
  //     this.fbUsername = "";
  //     this.uiVars.loading = false;
  //     this.uiVars.invalid = true;
  //   })
  // }

  // private routeToManage(selectedType){
  //   if(selectedType.botType === 'power'){
  //     this.router.navigate(['loading']);
  //       this.botService.addBotTypeToUser(selectedType);
  //       this.router.navigate(['manage']);
  //   } else {
  //     this.botService.addBotTypeToUser(selectedType);
  //     this.router.navigate(['manage']);
  //   }
  // }

}