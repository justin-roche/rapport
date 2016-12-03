import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { customBot, gmailContact } from '../shared/custom-type-classes';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { Store } from '../shared/store';

@Injectable()
export class ApiService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private store: Store){
    //this.signIn = this.signIn.bind(this);
  }
  
  public signIn() {
    let body = JSON.stringify(this.store.state.getValue().user.authResult);
    return this.http.post('/signIn', body, {headers: this.headers})
      .toPromise()
      .then((res)=>{
        return res.json()
      });
  }

  public getHolidays(){
    return this.http.get(`/api/holidays?year=${2016}`)
      .map((data: any) => {
        return data.json();
      })
      .toPromise();
  }
  //this.holidays = data;

  public getAllTasks(){
      return this.http.get('/api/tasks')
      .toPromise()
      .then((data)=>{
        return data.json();
      });
  }
  // this.allTasks = data;
  //       this.extendTasks(this.allTasks);

  public getBotTypes(){
    return this.http.get(`/api/botTypes`)
      .map((data: any)=>{          
          return data.json();
      })
      .toPromise();
  }
  //this.decorateAll(this.botTypes);

  public getBots(){
    var id = this.store.state.getValue().user.appUserInfo.id; 
    return this.http.get(`/api/bots?userId=${id}`)
      .map(function(data: any) {
        return JSON.parse(data._body);
      })
      .toPromise()
  }

}