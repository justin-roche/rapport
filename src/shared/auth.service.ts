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

declare var Auth0Lock: any;

@Injectable()
export class Auth {
  private lock = new Auth0Lock('pA75v0B8UDfNOk0h2tDnz5in4Je3AZHL', 'rapport.auth0.com', {});

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
      this.router.navigate(['setup']);
    } else {
      this.router.navigate(['manage']);
    }
  }

  public authenticated() {
    return tokenNotExpired();
  };

  
}