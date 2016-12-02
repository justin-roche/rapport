import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { customBot, gmailContact } from '../shared/custom-type-classes';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


@Injectable()
export class ApiService {

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
  }

}