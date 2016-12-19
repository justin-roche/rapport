// app/auth.service.ts

import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BotService } from './bot.service';
import { gmailContact } from '../shared/custom-type-classes';
import { FbService } from '../shared/fb.service';
import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';
import { ApiService } from '../shared/api.service';

declare var Auth0Lock: any;

@Injectable()
export class Auth {
<<<<<<< HEAD
  private lock = new Auth0Lock('pA75v0B8UDfNOk0h2tDnz5in4Je3AZHL', 'rapport.auth0.com', {});
=======

  private fbAuthenticated;

  lock = new Auth0Lock('pA75v0B8UDfNOk0h2tDnz5in4Je3AZHL', 'rapport.auth0.com', {});
  constructor(private apiService: ApiService, private reducers: Reducers, private store: Store, private http: Http, private router:Router, private botService: BotService, private fbService: FbService) {
>>>>>>> cleanup

  constructor(private http: Http, private router:Router, private botService: BotService, private gmailService: GmailService, private fbService: FbService) {
    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);
      this.router.navigate(['loading']);
      this.onAuthentication(authResult);
    });
    
  }
  
  public login() {
    this.lock.show();
  };

  public logout() {
    localStorage.removeItem('id_token');
  };

  public onAuthentication(authResult) {
<<<<<<< HEAD
    api.service.signIn(authResult)
    .then(this.setToken)
    .then(this.userActions.getInitialData)
    .then(this.fbActions.tryContacts)
    .then(this.redirectForUserType);
  }

  private setToken(userInfo){
    localStorage.setItem('user_id',userInfo.id);
  }

  public redirectForUserType(userObj) {
    if(userObj.newUser || this.botService.userBots.length===0){
=======

    //call api servers which call dispatch on their results

    //execute all of these in series
    
    this.reducers.dispatch('SET-AUTH-RESULT',authResult);
    this.apiService.signIn()
    .then(this.apiService.getGmailContacts.bind(this.apiService))
    .then(this.fbService.tryContacts.bind(this))
    .then(this.apiService.getHolidays.bind(this.apiService))
    .then(this.apiService.getAllTasks.bind(this.apiService))
    .then(this.apiService.getBotTypes.bind(this.apiService))
    .then(this.apiService.getBots.bind(this.apiService))
    .then(this.route.bind(this));
  }

  private route() {
    var userObj = this.store.state.getValue().user.appUserInfo;
    var userBots = this.store.state.getValue().bots.userBots;

    if(userObj.newUser || userBots.length===0){
>>>>>>> cleanup
      this.router.navigate(['setup']);
    } else {
      this.router.navigate(['manage']);
    }
  }

  // private setLocalStorage(){
  //   localStorage.setItem('user_id',this.store.state.getValue().user.appUserInfo.id);
  // }

  //  public signInUser(authResult) {
  //    let body = JSON.stringify(authResult);
  //    let headers = new Headers({'Content-Type': 'application/json'});
           
  //     //update user info from backend
  //     return this.http.post('/signIn', body, {headers: headers})
  //       .map(res => res.json()).toPromise();
  // }


  

 

  public authenticated() {
    return tokenNotExpired();
  };

  
}