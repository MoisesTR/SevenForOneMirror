import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {SharedModule} from '../../shared-module/shared.module';
import {MenuRoutingModule} from './menu.routing.module';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {ConfirmComponent} from '../confirm/confirm.component';

@NgModule({
  imports: [
    SharedModule,
    MenuRoutingModule
  ],
  declarations: [
    DashboardComponent,
    ConfirmComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})

export class MenuModule {}
