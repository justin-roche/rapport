import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { FilterContacts } from './contact.pipe';
import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';


@Component({
  selector: 'available-contacts-component',
  providers: [FilterContacts],
  styleUrls: ['app/available/available.component.css'],
  template: `<table class="table">
      <thead class="thead-inverse">
        <tr>
          <th>AVAILABLE CONTACTS</th>
        </tr>
      </thead>
        <tbody>
        <tr class="list-container">
          <td class="list-contents">
            <input type="text" [(ngModel)]="filterText">
              <ul class="contact-list">
                 <li (click)="reducers.dispatch('ADD-SELECTED-CONTACT',contact)" *ngFor="let contact of (store.state | async)?.bots.selectedBot.decorated.availableContacts | filterContacts: filterText"> {{ contact.fullName || contact.name }} </li>
               </ul>
          </td>
        </tr>
      </tbody>
    </table>
    `,         
})

export class AvailableContactsComponent {

  private filterText;

  constructor(private store: Store, private reducers: Reducers){
    store.state.subscribe((nextState)=>{
      

    });
  }

  

 }

  
