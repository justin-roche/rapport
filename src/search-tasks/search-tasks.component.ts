import { Component, OnInit, Input} from '@angular/core';
import { BotService } from '../shared/bot.service';
import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';

@Component({
  selector: 'tasks-component',
  providers: [],
  styleUrls: ['app/search-tasks/search-tasks.component.css'],
  templateUrl: 'app/search-tasks/search-tasks.component.html',
})
export class SearchTasksComponent {

  // private tasks: Array<string>;

  constructor(private store: Store, private reducers: Reducers) {}


}