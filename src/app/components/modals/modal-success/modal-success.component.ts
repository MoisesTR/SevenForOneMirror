import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {EventModal} from "../../../models/interface/EventModal";
import {ModalService} from "../../../core/services/shared/modal.service";
import {Subject} from "rxjs";
import {ModalDirective} from "ng-uikit-pro-standard";
import {takeUntil} from "rxjs/operators";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-modal-success',
  templateUrl: './modal-success.component.html',
  styleUrls: ['./modal-success.component.scss']
})
export class ModalSuccessComponent implements OnInit, EventModal, OnDestroy {

  @ViewChild("modalSuccess") modalSuccess: ModalDirective;

  @Output() okEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public title = 'Seven For One';
  public messageBody = '';
  public ngUnsubscribe = new Subject<void>();
  constructor(private modalService: ModalService, private logger: NGXLogger) { }

  ngOnInit() {
    this.subscribeEventModal();
  }

  resetAndHideModal() {
  }

  subscribeEventModal() {
    this.logger.info('SHOW MODAL SUCCESS');
    this.modalService.modalSucessEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      showModal => {
        if (showModal) {
          this.messageBody = this.modalService.messageBody;
          this.modalSuccess.show();
        } else {
          this.modalSuccess.hide();
        }
      }
    )

  }

  eventOK() {
    this.modalSuccess.hide();
    this.okEvent.emit(true);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
