import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DirectivesModule } from "../directives/directives.module";
import { ShowErrorsComponent } from "../components/show-errors.component";
import { NG_SELECT_DEFAULT_CONFIG, NgSelectModule } from "@ng-select/ng-select";
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { NativeDateTimeAdapter } from "ng-pick-datetime/date-time/adapter/native-date-time-adapter.class";
import { Platform } from "@angular/cdk/platform";
import {LockedScreenComponent} from "../components/locked-screen/locked-screen.component";
import {MDBBootstrapModulesPro} from "ng-uikit-pro-standard";

@NgModule({
	imports: [CommonModule],
	exports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		DirectivesModule,
		ShowErrorsComponent,
		NgSelectModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule
	],
	declarations: [ShowErrorsComponent],
	providers: [
		{
			provide: NG_SELECT_DEFAULT_CONFIG,
			useValue: {
				notFoundText: "Results not found"
			}
		},
		{ provide: OWL_DATE_TIME_LOCALE, useValue: "en" },
		{
			provide: DateTimeAdapter,
			useClass: NativeDateTimeAdapter,
			deps: [OWL_DATE_TIME_LOCALE, Platform]
		}
	]
})
export class SharedModule {}
