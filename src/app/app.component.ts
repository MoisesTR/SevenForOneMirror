import { Component } from "@angular/core";
import { makeStateKey, Meta, Title } from "@angular/platform-browser";

const configKey = makeStateKey("CONFIG");

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"]
})
export class AppComponent {
	nombreApp = "SevenForOne";
	title = "SevenForOne: Ganar Dinero Facil y Segura";
	descripcion =
		"Ganar dinero extra online de manera facil, " +
		"en esta aplicacion web podras duplicar tu dinero con SevenForOne ganas al instante invita a tus amigos para que las oportunidad de ganar sean mayores";
	keywords = "Dinero, internet, online, app, ganar, sevenforone, sevenxone, 7x1, 7for1";
	urlsitio = "";

	constructor(seo: Meta, title: Title) {
		//main tags
		seo.addTags([
			{ name: "keywords", content: this.keywords },
			{ name: "description", content: this.descripcion },
			{ name: "author", content: this.nombreApp },
			{ name: "robots", content: "index, follow" }
		]);

		//twitter meta datos
		seo.addTags([
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:title", content: this.title },
			{ name: "twitter:description", content: this.descripcion },
			{ name: "twitter:creator", content: this.nombreApp },
			{ name: "twitter:image", content: "assets/images/logo.png" }
		]);

		//open Graph data for facebook
		seo.addTags([
			{ property: "og:title", content: this.title },
			{ property: "og:type", content: "article" },
			{ property: "og:description", content: this.descripcion },
			{ property: "og:url", content: this.urlsitio },
			{ property: "og:site_name", content: this.nombreApp },
			{ property: "og:image", content: "assets/images/logo.png" },
			{ property: "article:section", content: "SevenForOne Ganar Dinero" },
			{ property: "article:tag", contetn: "sevenforone" }
		]);
	}
}
