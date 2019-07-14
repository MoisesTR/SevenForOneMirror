import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "imageUser"
})
export class ImageUserPipe implements PipeTransform {
	public transform(value: string) {
		return value || "assets/images/main-user.png";
	}
}
