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
import { GmailService } from '../shared/gmail.service';
import { FbService } from '../shared/fb.service';
import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';

declare var Auth0Lock: any;

@Injectable()
export class Auth {
  // Configure Auth0
  lock = new Auth0Lock('pA75v0B8UDfNOk0h2tDnz5in4Je3AZHL', 'rapport.auth0.com', {});
  constructor(private reducers: Reducers, private store: Store, private http: Http, private router:Router, private botService: BotService, private gmailService: GmailService, private fbService: FbService) {

    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);
      this.router.navigate(['loading']);
      this.onAuthentication(authResult);
    });
  }
  
  public login() {
    // Call the show method to display the widget./
    this.lock.show();
  };

  public onAuthentication(authResult) {
    this.signInUser(authResult)
      .then(userInfo => {
        this.reducers.dispatch('SET',{appUserInfo: userInfo});
      })
      .then(this.botService.getInitialData)  
      .then(this.gmailService.getContacts)
      .then(this.fbService.tryContacts)
      .then(this.reducers.dispatch.bind(this.reducers,'ROUTE',{}));
  }

  private setLocalStorage(){
    localStorage.setItem('user_id',this.store.state.getValue().appUserInfo.id);
  }

  public signInUser(authResult) {
     let body = JSON.stringify(authResult);
     let headers = new Headers({'Content-Type': 'application/json'});
           
      //update user info from backend
      return this.http.post('/signIn', body, {headers: headers})
        .map(res => res.json()).toPromise();
  }

  public redirectForUserType() {
    var userObj = this.store.state.getValue().appUserInfo;
    var userBots = this.store.state.getValue().bots.userBots;

    if(userObj.newUser || userBots.length===0){
      this.router.navigate(['setup']);
    } else {
      this.router.navigate(['manage']);
    }
  }

  public authenticated() {
    return tokenNotExpired();
  };

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
  };
}