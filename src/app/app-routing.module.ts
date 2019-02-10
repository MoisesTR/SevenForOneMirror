import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { MenuComponent } from "./components/menu/menu.component";
import {NotFound404Component} from './components/not-found404/not-found404.component';

export const routes: Routes = [
	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegisterComponent },
	{
		path: "",
		component: MenuComponent,
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
export class AppRoutingModule {}
