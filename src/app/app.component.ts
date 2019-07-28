import {Meta, Title} from '@angular/platform-browser';
import { Component, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ { provide: LOCALE_ID, useValue: 'en' } ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  nombreApp = 'SevenForOne';
  title = 'SevenForOne: Ganar Dinero Facil y Seguro';
  descripcion = 'Ganar dinero extra online de manera facil, ' +
    'en esta pagina web podras duplicar tu dinero con SevenForOne ganas al instante invita a tus amigos para que las oportunidad de ganar sean mayores';
  urlsitio = '';

  constructor(seo: Meta, title: Title) {

    //twitter meta datos
    seo.addTags([
      {name: 'twitter:card', content: 'summary'},
      {name: 'twitter:title', content: this.title},
      {name: 'twitter:description', content: this.descripcion},
      {name: 'twitter:creator', content: this.nombreApp},
      {name: 'twitter:image', content: 'https://avatars3.githubusercontent.com/u/16628445?v=3&s=200'}
    ]);

    //open Graph data for facebook

    seo.addTags([
      {property: 'og:title', content: this.title},
      {property: 'og:type', content: 'article'},
      {property: 'og:description', content: this.descripcion},
      {property: 'og:url', content: this.urlsitio},
      {property: 'og:site_name', content: this.nombreApp},
      {property: 'og:image', content: 'https://avatars3.githubusercontent.com/u/16628445?v=3&s=200'},
      {property: 'article:section', content: 'SevenForOne Ganar Dinero'},
      {property: 'article:tag', contetn: 'sevenforone'},
    ]);
  }

}


