import { Component, OnInit, Input} from '@angular/core';
import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';

@Component({
  selector: 'tasks-component',
  styleUrls: ['app/search-tasks/search-tasks.component.css'],
  templateUrl: 'app/search-tasks/search-tasks.component.html',
})
export class SearchTasksComponent {

  constructor(private store: Store, private reducers: Reducers) {}

}