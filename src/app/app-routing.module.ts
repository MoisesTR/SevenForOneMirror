import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { MenuComponent } from "./components/menu/menu.component";
import { NotFound404Component } from "./components/not-found404/not-found404.component";
import { AuthGuardService } from "./core/services/auth/auth-guard.service";
import { ConfirmComponent } from "./components/confirm/confirm.component";
import { LoginGuardService } from './core/services/auth/login.guard.service';
import { EmailConfirmComponent } from './components/email-confirm/email-confirm.component';

export const routes: Routes = [
	{ path: "login", canActivate: [LoginGuardService], component: LoginComponent },
	{ path: "register", canActivate: [LoginGuardService], component: RegisterComponent },
	{ path: "confirm/:token", component: ConfirmComponent, data: { titulo: "Confirm" } },
<<<<<<< Updated upstream
	{ path: "emailConfirm", canActivate: [LoginGuardService], component: EmailConfirmComponent },
=======
	{ path: "emailConfirm", component: EmailConfirmComponent },
>>>>>>> Stashed changes
	{
		path: "",
		component: MenuComponent,
		canActivate: [AuthGuardService],
		loadChildren: "./components/menu/menu.module#MenuModule",
		data: { titulo: "Menu" }
	},
	{
		path: "**",
		component: NotFound404Component,
		data: {
			titulo: "No encontrado"
		}
	}
];
@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule],
	declarations: []
})
export class AppRoutingModule { }
