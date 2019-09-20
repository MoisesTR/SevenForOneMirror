import { Pipe, PipeTransform } from "@angular/core";
import { Global } from "../core/services/shared/global";
import { NGXLogger } from "ngx-logger";
import { ImageService } from "../core/services/shared/image.service";
import { Observable, of } from "rxjs";

@Pipe({
	name: "imageUserSrc"
})
export class ImageUserSrcPipe implements PipeTransform {
	constructor(public logger: NGXLogger, private imageService: ImageService) {}
	transform(img: string, folder: string = "user"): Observable<any> {
		const url = Global.urlAuth + "getImage";
		// IF IMG NOT EXISTS RETURN MAIN USER IMG
		if (!img) {
			img = "assets/images/main-user.png";
			return of(img);
		}

		// IF IMG INCLUDE HTTP OR ASSETS IN BODY, RETURN THE SAME VALUE OF IMG
		if (img.includes("http") || img.includes("assets")) {
			return of(img);
		}

		// INACTIVE STATUS IMAGE CIRCLES EIN GAME, RETURN EMPTY VALUE
		if (img === "inactive") {
			return of("");
		}

		switch (folder) {
			case "user":
				return this.imageService.getImage(url + "/user/" + img);
			case "temp":
				return this.imageService.getImage(url + "/temp/" + img);
			default:
				this.logger.info("El folder de la imagen no existe!");
		}
	}
}
