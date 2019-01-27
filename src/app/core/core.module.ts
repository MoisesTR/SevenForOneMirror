import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { throwIfAlreadyLoaded } from "./module-import-guard";
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
	imports: [],
	exports: [CommonModule, ReactiveFormsModule],
	declarations: []
})
export class CoreModule {
	constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		throwIfAlreadyLoaded(parentModule, "CoreModule");
	}
}
