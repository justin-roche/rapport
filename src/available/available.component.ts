import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { FilterContacts } from './contact.pipe';
import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';


@Component({
  selector: 'available-contacts-component',
  providers: [FilterContacts],
  styleUrls: ['app/available/available.component.css'],
  template: `<input type="text" [(ngModel)]="filterText">
              <ul class="contact-list">
                 <li (click)="reducers.dispatch('ADD-SELECTED-CONTACT',contact)" *ngFor="let contact of (store.state | async)?.manageView.availableContacts | filterContacts: filterText"> {{ contact.fullName || contact.name }} </li>
               </ul>`,         
})

export class AvailableContactsComponent {

  private filterText;

  constructor(private store: Store, private reducers: Reducers){
    store.state.subscribe((nextState)=>{
      

    });
  }

 }

  //reload: void {
    // if(this.bot.botType === 'social'){
    //   this.contacts = this.fbService.contacts;
    //   const addedFriends = this.bot.selectedFbFriends.map(contact => contact.vanity);
    //   this.contacts = this.contacts.filter(contact => {
    //     return addedFriends.indexOf(contact.vanity) === -1;
    //   });
    // } else {
    //   // this.contacts = this.gmailService.contacts.filter(contact => {
    //   //   const selectedContactNames = this.bot.selectedContacts.map(contact => contact.name);
    //   //   return contact.name && contact.email && selectedContactNames.indexOf(contact.name) === -1;
    //   // });
    // }
  //}
