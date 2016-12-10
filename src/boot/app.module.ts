import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpModule }    from '@angular/http';
import { RouterModule }   from '@angular/router';
import { AUTH_PROVIDERS }      from 'angular2-jwt';

import { LogInGuard } from '../shared/logged-in.guard';
import { AuthGuard } from '../shared/auth.guard';
import { Auth0CallbackGuard } from '../shared/auth0.guard';
import { BotService }         from '../shared/bot.service';
import { Auth } from '../shared/auth.service';
import { FbService } from '../shared/fb.service';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AppRoutingModule }     from '../routing/app.routing.module';
import { AppComponent }        from '../app/app.component';
import { LandingPageComponent }   from '../landing-page/landing-page.component';
import { SetupComponent }    from '../setup/setup.component';
import { ManageComponent }    from '../manage/manage.component';
import { TaskModalComponent }    from '../task-modal/task-modal.component';
import { ContactComponent }    from '../contact/contact.component';
import { HomePageComponent } from '../home-page/home.component';
import { AvailableBotsComponent } from '../available-bots/available-bots.component';
import { AvailableContactsComponent } from '../available/available.component';
import { SelectedContactsComponent } from '../selected/selected.component';
import { SearchTasksComponent } from '../search-tasks/search-tasks.component';
import { FilterContacts } from '../available/contact.pipe';
import { LoadingComponent } from '../loading/loading.component';
import { ActivitiesTable } from '../activities-table/activities-table.component';
import { ActivitiesContainer } from '../view-activities/view-activities.component';

import { Store } from '../shared/store';
import { Reducers } from '../shared/reducers';
import { ApiService } from '../shared/api.service';
import { DecoratorService } from '../shared/decorator.service';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    Ng2Bs3ModalModule
  ],
  declarations: [
    ActivitiesContainer,
    ActivitiesTable,
    HomePageComponent,
    AppComponent,
    LandingPageComponent,
    SetupComponent,
    ManageComponent,
    TaskModalComponent,
    ContactComponent,
    AvailableBotsComponent,
    AvailableContactsComponent,
    SelectedContactsComponent,
    SearchTasksComponent,
    FilterContacts,
    LoadingComponent
  ],
  providers: [
    { provide: 'Window',  useValue: window },
    //{provide: LocationStrategy, useClass: HashLocationStrategy},
    BotService,
    Auth,
    Store,
    Reducers,
    ApiService,
    FbService,
    DecoratorService,
    LogInGuard,
    AuthGuard,
    Auth0CallbackGuard,
    AUTH_PROVIDERS
  ],
  bootstrap: [ AppComponent ],
  //entryComponents: [ CustomModal ]
})
export class AppModule {
}


