import { Component, OnInit, Input} from '@angular/core';
import { BotService } from '../shared/bot.service';
import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';

@Component({
  selector: 'tasks-component',
  providers: [],
  styleUrls: ['app/search-tasks/search-tasks.component.css'],
  // template: `<input type="text" [(ngModel)]="filterText">
  //             <ul>
  //               <li *ngFor="let task of (store.state | async)?.bots.selectedBot.tasks" (click)="onAddTask(task)"> {{ task }} </li>
  //             </ul>
  // `,

  template: `<tr *ngFor="let task of (store.state | async)?.bots.selectedBot.tasks"
                          [class.subTask]="task.decorated && task.decorated.subTask === true"
                          [class.selected]="task === selectedTask"
                          (click)="onSelectTask(task)">
                          {{task.name}}
                          <p *ngIf="task.decorated && task.decorated.formattedName">
                            {{task.decorated.formattedName}}
                          <span class="glyphicon glyphicon-remove" (click)="store.actions('DELETE-TASK',{bot: selectedBot, task: task})"></span>
                          <span class="glyphicon" [ngClass]="{'glyphicon-pencil': !task.decorated.masterTask, 'glyphicon-plus' : task.decorated.masterTask }" (click)="open(task)"></span>
                          </p>
                  </tr>`
})
export class SearchTasksComponent {

  // private tasks: Array<string>;

  constructor(private store: Store) {}

  // onAddTask(selectedTask): void{
  //   let selectedTaskIndex = this.tasks.indexOf(selectedTask);
  //   this.bot.tasks.push (selectedTask);
  //   this.tasks.splice(selectedTaskIndex,1);
  // }

  // ngOnInit(): void {
  //   this.tasks = this.botService.tasks.filter(task => {
  //    return this.bot.tasks.indexOf(task) === -1;
  //   }); 
  // }

  //@Input() bot;

}