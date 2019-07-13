import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor() { }

  visible: boolean = true;
  
  ngOnInit() {
    setTimeout(() => {
      this.visible = false;
    }, 3000);
  }

}
