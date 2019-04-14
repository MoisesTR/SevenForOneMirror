import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    $(document).ready(() => {
			$(".dropify").dropify();
		});
  }

}
