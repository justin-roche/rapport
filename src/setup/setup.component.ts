import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { Store } from '../shared/store';
import { FbService } from '../shared/fb.service';
import { Reducers } from '../shared/reducers';
import { Router } from '@angular/router';

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
  fbLoggedIn = false;
  selectedType;

  // close() {
  //     this.fbUsername = "";
  //     this.fbPassword = "";
  //     this.modal.close();
  // }

  constructor(private router: Router, private reducers: Reducers, private fbService: FbService, private store: Store){
    store.state.subscribe((nextState)=>{
      this.bots = nextState.bots.botTypes; 
      this.fbLoggedIn = nextState.user.fbContacts;
    });
  }

  private selectBot(selectedType){
    if(selectedType.botType === 'social' && !this.fbLoggedIn){
      this.modal.open();
    } else if(selectedType.botType === 'power'){
     this.powerModal.open();
    } else {
      this.createNewBot(selectedType);
    }
  }

  private fbLogin(){
    this.uiVars.loading = true;
    this.fbService.login(this.fbUsername, this.fbPassword)
    .then(this.createNewBot.bind(this,this.bots[1]))
    .catch(()=>{
      this.fbPassword = "";
      this.fbUsername = "";
      this.uiVars.loading = false;
      this.uiVars.invalid = true;
    })
  }

  private createNewBot(bot){
    this.reducers.dispatch('ADD-NEW-BOT', bot);
    this.router.navigate(['manage']);
  }

  // closePower() {
  //     powerModal.close();
  // }

  @ViewChild('myModal')
  modal: ModalComponent;

  @ViewChild('powerModal')
  powerModal: ModalComponent;

  

  

}