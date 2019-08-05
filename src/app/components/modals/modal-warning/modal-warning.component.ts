import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from "ng-uikit-pro-standard";
import {Subject} from "rxjs";
import {ModalService} from "../../../core/services/shared/modal.service";
import {NGXLogger} from "ngx-logger";
import {takeUntil} from "rxjs/operators";
import {EventModal} from "../../../models/interface/EventModal";

@Component({
  selector: 'app-modal-warning',
  templateUrl: './modal-warning.component.html',
  styleUrls: ['./modal-warning.component.scss']
})
export class ModalWarningComponent implements OnInit, EventModal, OnDestroy {

  @ViewChild("modalWarning") modalWarning: ModalDirective;

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
    this.logger.info('SHOW MODAL WARNING');
    this.modalService.modalWarningEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      showModal => {
        if (showModal) {
          this.messageBody = this.modalService.messageBody;
          this.modalWarning.show();
        } else {
          this.modalWarning.hide();
        }
      }
    )

  }

  emitEventOk() {
    this.modalWarning.hide();
    this.okEvent.emit(true);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
