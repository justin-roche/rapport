import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';


@Component({
  selector: 'available-bots-component',
  styleUrls: ['app/available-bots/available-bots.component.css'],
  templateUrl: 'app/available-bots/available-bots.component.html',         
})

export class AvailableBotsComponent {

  private editableBot;

  constructor(private store: Store, private reducers: Reducers){
    
  }

  private onSelectBot(bot: any): void {
    //call reducer
  }

}