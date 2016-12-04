import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '../shared/store';
import { ApiService } from '../shared/api.service';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FbService {

    public contacts: Array<any>;
    private fbAuthenticated;

    constructor(private apiService: ApiService, private store: Store, private http: Http){

        this.tryContacts = this.tryContacts.bind(this);

        store.state.subscribe((nextState)=>{
            var appUserInfo = nextState.user.appUserInfo;
            this.fbAuthenticated = appUserInfo ? appUserInfo.fbCredentials: null;
        });
    }

    public tryContacts(){
        if(this.fbAuthenticated){
            return this.apiService.getFbContacts();
        }  
    }

    

    public login(fbUsername: String, fbPassword: String){
        return this.apiService.updateFbCredentials(fbUsername, fbPassword)
        .then(this.apiService.getFbContacts.bind(this.apiService));
    }

    // public saveCredentials(fbUsername: String, fbPassword: String){
    //     let headers = new Headers({'Content-Type': 'application/json'});
    //     var body = {
    //         fbEmail: fbUsername,
    //         fbPassword: fbPassword,
    //     };

    //     
    // }

   

};


