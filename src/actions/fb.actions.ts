import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '../shared/store';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FbService {

    public contacts: Array<any>;

    constructor(private http: Http, private store: Store){

    }

    public tryContacts(){
        if(this.store.state.getValue().user.fbCredentials){
            return this.getContacts(userObj.id);
        }  
    }

    public login(fbUsername: String, fbPassword: String){
        return this.updateCredentials(fbUsername, fbPassword)
        .then(this.getContacts);
    }

    private updateCredentials(fbUsername: String, fbPassword: String){
        return api.service.updateFbCredentials({
            fbEmail: fbUsername,
            fbPassword: fbPassword,
        });
    }

    public getContacts(){
        //store.fbContacts = api.getFbContacts()
    }

};


