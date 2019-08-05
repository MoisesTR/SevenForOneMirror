import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from "ng-uikit-pro-standard";
import {Subject} from "rxjs";
import {ModalService} from "../../../core/services/shared/modal.service";
import {NGXLogger} from "ngx-logger";
import {takeUntil} from "rxjs/operators";
import {EventModal} from "../../../models/interface/EventModal";

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.scss']
})
export class ModalErrorComponent implements OnInit, EventModal, OnDestroy {

  @ViewChild("modalError") modalError: ModalDirective;

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
    this.logger.info('SHOW MODAL ERROR');
    this.modalService.modalErrorEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      showModal => {
        if (showModal) {
          this.messageBody = this.modalService.messageBody;
          this.modalError.show();
        } else {
          this.modalError.hide();
        }
      }
    )
  }

  emitEventOk() {
    this.modalError.hide();
    this.okEvent.emit(true);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
