import { enableProdMode, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

declare const require;
var translations;
 let location = window.location.hostname.split(".");

 if(location[0] == "es"){
  translations = require(`raw-loader!./translate/messages.es.xlf`);

 }else{
   translations = null;
 }

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule,
    {
      providers:[
        {provide: TRANSLATIONS, useValue: translations},
        {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'}
      ]
    })
    .catch(err => console.log(err));
});
