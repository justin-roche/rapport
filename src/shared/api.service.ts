import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { customBot, gmailContact } from '../shared/custom-type-classes';
<<<<<<< HEAD
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

=======
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';
>>>>>>> cleanup

@Injectable()
export class ApiService {

<<<<<<< HEAD
  constructor(private http: Http){

  }

  private userId; 
  private token;
  private headers = {headers: new Headers({'Content-Type': 'application/json'})};

//<----------------------AUTHENTICATION CALLS---------------------->

  public signIn(authResult) {
      return this.http.post('/signIn', body, {headers: headers})
        .map(res => res.json()).toPromise();
  }

  public updateFbCredentials(){
    return this.http.post('/updateFacebookCredentials', body, {headers: headers})
        .toPromise()
        .then((data)=>{
            console.log('save credentials resolved');
            //this.contacts = data.json(); 
        });
  }

//<----------------------BOT API CALLS---------------------->

  public getBots(){
    return this.http.get(`/api/bots?userId=${this.userId}`)
      .map(function(data: any) {
        return JSON.parse(data._body);
      })
      .toPromise()
  }

  public postBots(){
    const body = JSON.stringify({bots: this.userBots});
    return this.http.put(`/api/bots?userId=${this.userId}`, body, this.headers)
    .toPromise()
  }

  public deleteTasks(){
    const body = JSON.stringify({tasks: this.deletedTasks});
    return this.http.post('/api/tasks', body, this.headers)
    .toPromise();
  }

  //<----------------------CONTACT API CALLS---------------------->


  public removeGmailContact(contact){
    return this.http.delete(`/api/gmail/contacts?contactId=${contact.id}`).toPromise()
    .then(this.importUserBots.bind(this));
  }

  public removeFbContact(contact){
    return this.http.delete(`/api/facebook/friends?contactId=${contact.id}`).toPromise()
    .then(this.importUserBots.bind(this));
  }

  

  public getFbContacts(){
    return this.http.get(`/api/facebook/friends?userId=${userId}`)
            .toPromise()
            .then(data => {
                console.log('get contacts resolved');
      });
=======
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

  //testing/demo method
  public sendNow(){
    return this.http.get('/api/runalltasks').toPromise();
>>>>>>> cleanup
  }

}