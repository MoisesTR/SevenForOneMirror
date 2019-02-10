import { NgModule } from "@angular/core";
import { AcceptCharactersDirective } from "../directives/acceptcaracter.directive";
import { AlphanumericDirective } from "../directives/alphanumeric.directive";
import { NegOrPosNumbergDirective } from "../directives/negorposnumber.directive";
import { NumbersOnlyIntDirective } from "../directives/numbers-only-int.directive";
import { NumberOnlyDirective } from "../directives/onlynumber.directive";
import { NumberDirective } from "../directives/onlypositivenumber.directive";

@NgModule({
	imports: [],
	exports: [
		AcceptCharactersDirective,
		AlphanumericDirective,
		NegOrPosNumbergDirective,
		NumbersOnlyIntDirective,
		NumberOnlyDirective,
		NumberDirective
	],
	declarations: [
		AcceptCharactersDirective,
		AlphanumericDirective,
		NegOrPosNumbergDirective,
		NumbersOnlyIntDirective,
		NumberOnlyDirective,
		NumberDirective
	]
})
export class DirectivesModule {}
