import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../shared/auth.service';

@Component({
  selector: 'my-heroes',
  //providers: [Auth,GmailLoginComponent],
  //template: `<p>Welcome </p>`
  templateUrl: 'app/landing-page/landing-page.component.html',
  styleUrls: ['app/landing-page/landing-page.component.css']
})

export class LandingPageComponent {
  constructor(private router: Router, private auth: Auth
  ) {}

  login(){
    this.auth.login();
  }

  ngOnInit(): void {

  }
}
