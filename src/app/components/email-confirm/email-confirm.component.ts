import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-email-confirm',
  templateUrl: './email-confirm.component.html',
  styleUrls: ['./email-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailConfirmComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  checkOut() {
    this.router.navigate(['/login']);
  }

}
