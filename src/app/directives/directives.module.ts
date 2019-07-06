import { NgModule } from "@angular/core";
import { AcceptCharactersDirective } from "../directives/acceptcaracter.directive";
import { AlphanumericDirective } from "../directives/alphanumeric.directive";
import { NegOrPosNumbergDirective } from "../directives/negorposnumber.directive";
import { NumbersOnlyIntDirective } from "../directives/numbers-only-int.directive";
import { NumberOnlyDirective } from "../directives/onlynumber.directive";
import { NumberDirective } from "../directives/onlypositivenumber.directive";
import { EqualValidatorDirective } from "../directives/equal.directive";

@NgModule({
	imports: [],
	exports: [
		AcceptCharactersDirective,
		AlphanumericDirective,
		NegOrPosNumbergDirective,
		NumbersOnlyIntDirective,
		NumberOnlyDirective,
		NumberDirective,
		EqualValidatorDirective
	],
	declarations: [	
		AcceptCharactersDirective,
		AlphanumericDirective,
		NegOrPosNumbergDirective,
		NumbersOnlyIntDirective,
		NumberOnlyDirective,
		NumberDirective,
		EqualValidatorDirective
	]
})
export class DirectivesModule {}
