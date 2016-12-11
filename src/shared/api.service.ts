import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { customBot, gmailContact } from '../shared/custom-type-classes';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';

@Injectable()
export class ApiService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private reducers: Reducers, private http: Http, private store: Store){
    //this.signIn = this.signIn.bind(this);
  }
  
  public signIn() {
    let body = JSON.stringify(this.store.state.getValue().user.authResult);
    return this.http.post('/signIn', body, {headers: this.headers})
      .toPromise()
      .then((res)=>{
        this.reducers.dispatch('SET-USER-INFO',res.json());
      });
  }

  public getHolidays(){
    return this.http.get(`/api/holidays?year=${2016}`)
      .toPromise()
      .then((res) => {
        this.reducers.dispatch('SET-HOLIDAYS',res.json());
      });
  }
  //this.holidays = data;

  public getAllTasks(){
      return this.http.get('/api/tasks')
      .toPromise()
      .then((res)=>{
        this.reducers.dispatch('SET-ALL-TASKS',res.json());
      });
  }
  // this.allTasks = data;
  //       this.extendTasks(this.allTasks);

  public getBotTypes(){
    return this.http.get(`/api/botTypes`)
      .toPromise()
      .then((res)=>{          
          this.reducers.dispatch('SET-BOT-TYPES',res.json());
      });
  }
  //this.decorateAll(this.botTypes);

  public getBots(){
    var id = this.store.state.getValue().user.appUserInfo.id; 
    return this.http.get(`/api/bots?userId=${id}`)
      .toPromise()
      .then((res)=> {
        this.reducers.dispatch('SET-BOTS',res.json());
      });
  }

  public getGmailContacts(){
    var id = this.store.state.getValue().user.appUserInfo.id; 
    return this.http.get(`/api/gmail/contacts?userId=${id}`)
    .toPromise()
    .then((res) => {
      this.reducers.dispatch('SET-GMAIL-CONTACTS',res.json());
    });
  }

   public getFbContacts(){
    var id = this.store.state.getValue().user.appUserInfo.id; 
    return this.http.get(`/api/facebook/friends?userId=${id}`)
      .toPromise()
      .then(res => {
        this.reducers.dispatch('SET-FB-CONTACTS',res.json());
      });
    }

    public updateFbCredentials(username, password){
      var body = {
            fbEmail: username,
            fbPassword: password,
        };
      return this.http.post('/updateFacebookCredentials', body, {headers: this.headers})
        .toPromise()
        .then((res)=>{
            this.reducers.dispatch('SET-FB-CREDENTIALS',{});
        });
    }

  public postBots(bots){
    var id = this.store.state.getValue().user.appUserInfo.id; 
    const body = JSON.stringify({bots: bots});
    return this.http.put(`/api/bots?userId=${id}`, body, {headers: this.headers})
    .toPromise()
  }

  //todo: route must be authenticated
  public deleteBot(selectedBot){
    return this.http.delete(`/api/bots?botId=${selectedBot.id}`)
    .toPromise()
  }

  public deleteTasks(deletedTasks){
    const body = JSON.stringify({tasks: deletedTasks});
    return this.http.post('/api/tasks', body, {headers: this.headers})
    .toPromise();
  }

}