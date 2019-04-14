import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(seo: Meta, title: Title) {

    // title.setTitle('Probando el seo');
    seo.addTags([
      { name: 'author', content: 'Moises Israel' },
      { name: 'keywords', content: 'Money, mucho dinero, Dinero, billetes' },
      { name: 'description', content: 'con este app ganaras dinero a lo grande, asi que descargala' }
    ]);

    //twitter meta datos
    seo.addTags([
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Probando el titulo' },
      { name: 'twitter:description', content: 'Probando la descripcion de esta app' },
      { name: 'twitter:creator', content: '@pruebacompartir' },
      { name: 'twitter:image', content: 'https://avatars3.githubusercontent.com/u/16628445?v=3&s=200' }
    ]);

    //open Graph data for facebook

    seo.addTags([
      { name: ' og:title', content: 'Titulo en Face' },
      { name: 'og:type', content: 'article' },
      { name: 'og:description', content: 'Descripcion facebook aqui' },
      { name: 'og:image', content: 'https://avatars3.githubusercontent.com/u/16628445?v=3&s=200' }

    ]);

    //google +

  }

}


