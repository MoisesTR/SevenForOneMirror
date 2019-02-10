import { Component, OnInit } from "@angular/core";
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(document).ready(() => {
      $('.input100').each(function () {
        $(this).on('blur', function () {
          if ($(this).val().trim() != "") {
            $(this).addClass('has-val');
          }
          else {
            $(this).removeClass('has-val');
          }
        })
      })
    });
  }
}
