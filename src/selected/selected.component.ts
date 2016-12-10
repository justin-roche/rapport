import { Component, ViewChild } from '@angular/core';
import { customBot, gmailContact } from '../shared/custom-type-classes';
import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';

@Component({
  selector: 'selected-contacts-component',
  templateUrl: 'app/selected/selected.component.html',
  styleUrls: ['app/selected/selected.component.css']
})

export class SelectedContactsComponent {


  constructor(private store: Store){
    
  }

  
}


