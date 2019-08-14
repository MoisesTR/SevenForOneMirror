import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DirectivesModule } from "../directives/directives.module";
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { NativeDateTimeAdapter } from "ng-pick-datetime/date-time/adapter/native-date-time-adapter.class";
import { Platform } from "@angular/cdk/platform";
import { NgxSpinnerModule } from "ngx-spinner";
import { ImageUserPipe } from "../pipe/image-user.pipe";
import { EmptyRecordsComponent } from "../components/empty-records/empty-records.component";
import { ShowErrorsComponent } from "../components/show-errors.component";

@NgModule({
	imports: [CommonModule],
	exports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		DirectivesModule,
		ShowErrorsComponent,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		NgxSpinnerModule,
		ImageUserPipe,
		EmptyRecordsComponent
	],
	declarations: [ShowErrorsComponent, ImageUserPipe, EmptyRecordsComponent],
	providers: [
		{ provide: OWL_DATE_TIME_LOCALE, useValue: "es" },
		{
			provide: DateTimeAdapter,
			useClass: NativeDateTimeAdapter,
			deps: [OWL_DATE_TIME_LOCALE, Platform]
		}
	]
})
export class SharedModule {}
