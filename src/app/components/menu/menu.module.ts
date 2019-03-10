import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedModule } from "../../shared-module/shared.module";
import { MenuRoutingModule } from "./menu.routing.module";
import { DashboardComponent } from "../dashboard/dashboard.component";
import {MDBBootstrapModulesPro} from 'ng-uikit-pro-standard';

@NgModule({
	imports: [SharedModule, MenuRoutingModule, MDBBootstrapModulesPro],
  exports: [MDBBootstrapModulesPro],
	declarations: [DashboardComponent],
	schemas: [NO_ERRORS_SCHEMA]
})
export class MenuModule {}
