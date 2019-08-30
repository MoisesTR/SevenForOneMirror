import { Pipe, PipeTransform } from "@angular/core";
import { Global } from "../core/services/shared/global";
import { NGXLogger } from "ngx-logger";
import { ImageService } from "../core/services/shared/image.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable, of } from "rxjs";

@Pipe({
	name: "imageUserStyle"
})
export class ImageUserStylePipe implements PipeTransform {
	constructor(public logger: NGXLogger, private imageService: ImageService, private domSanitizer: DomSanitizer) {}
	transform(img: string, folder: string = "user"): Observable<any> {
		const url = Global.urlAuth + "getImage";

		// IF IMG NOT EXISTS RETURN MAIN USER IMG
		if (!img) {
			img = "assets/images/main-user.png";
			return of(this.domSanitizer.bypassSecurityTrustStyle(`url('${img}')`));
		}

		// IF IMG INCLUDE HTTP OR ASSETS IN BODY, RETURN THE SAME VALUE OF IMG
		if (img.includes("http") || img.includes("assets")) {
			return of(this.domSanitizer.bypassSecurityTrustStyle(`url('${img}')`));
		}

		// INACTIVE STATUS IMAGE CIRCLES EIN GAME, RETURN EMPTY VALUE
		if (img === "inactive") {
			return of(this.domSanitizer.bypassSecurityTrustStyle(`url('${img}')`));
		}

		switch (folder) {
			case "user":
				img = "assets/images/main-user.png";
				return of(this.domSanitizer.bypassSecurityTrustStyle(`url('${img}')`));
			// return this.imageService.getImage(url + "/user/" + img);
			case "temp":
				return this.imageService.getImage(url + "/temp/" + img);
			default:
				console.log(folder);
				this.logger.info("El folder de la imagen no existe!");
		}
	}
}
