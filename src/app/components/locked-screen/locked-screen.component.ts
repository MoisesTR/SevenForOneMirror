import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../core/services/auth/auth.service";
import {Location} from "@angular/common";
import {MainSocketService} from "../../core/services/shared/main-socket.service";

@Component({
  selector: 'app-locked-screen',
  templateUrl: './locked-screen.component.html',
  styleUrls: ['./locked-screen.component.scss']
})
export class LockedScreenComponent implements OnInit {

  constructor(private authService: AuthService, private mainSocketService: MainSocketService, private location: Location) { }

  ngOnInit() {
  }

  close() {
    this.authService.logout();
  }

  stayHere() {
    this.mainSocketService.connect();
    this.location.back();
  }

}
