import { NgModule } from "@angular/core";
import { AlphanumericDirective } from "./alphanumeric.directive";
import { NumbersOnlyIntDirective } from "./numbers-only-int.directive";
import { NumberOnlyDirective } from "./onlynumber.directive";
import { ImagePreloadDirectiveDirective } from "./image-preload-directive.directive";

@NgModule({
	imports: [],
	exports: [AlphanumericDirective, NumbersOnlyIntDirective, NumberOnlyDirective, ImagePreloadDirectiveDirective],
	declarations: [AlphanumericDirective, NumbersOnlyIntDirective, NumberOnlyDirective, ImagePreloadDirectiveDirective]
})
export class DirectivesModule {}
