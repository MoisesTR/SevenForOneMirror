import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {AppRoutingModule} from './app-routing.module';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {MDBBootstrapModulesPro, MDBSpinningPreloader} from 'ng-uikit-pro-standard';
import {MenuComponent} from './components/menu/menu.component';
import {NotFound404Component} from './components/not-found404/not-found404.component';
import {ConfirmComponent} from './components/confirm/confirm.component';
import {EmailConfirmComponent} from './components/email-confirm/email-confirm.component';
import {ParticlesModule} from 'angular-particle';
import { UsersComponent } from './components/users/users.component';
import { ProfileComponent } from './components/profile/profile.component';
import { GroupsComponent } from './components/groups/groups.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		ConfirmComponent,
		NotFound404Component,
		MenuComponent,
		NotFound404Component,
		EmailConfirmComponent,
		UsersComponent,
		ProfileComponent,
		GroupsComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		CoreModule,
		AppRoutingModule,
		MDBBootstrapModulesPro.forRoot(),
		ParticlesModule
	],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [MDBSpinningPreloader],
	bootstrap: [AppComponent]
})
export class AppModule {}
