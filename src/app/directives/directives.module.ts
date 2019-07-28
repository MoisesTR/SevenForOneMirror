import { NgModule } from "@angular/core";
import { AlphanumericDirective } from "./alphanumeric.directive";
import { NumbersOnlyIntDirective } from "./numbers-only-int.directive";
import { NumberOnlyDirective } from "./onlynumber.directive";

@NgModule({
	imports: [],
	exports: [AlphanumericDirective, NumbersOnlyIntDirective, NumberOnlyDirective],
	declarations: [AlphanumericDirective, NumbersOnlyIntDirective, NumberOnlyDirective]
})
export class DirectivesModule {}
