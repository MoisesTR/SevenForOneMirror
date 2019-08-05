import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from "ng-uikit-pro-standard";
import {Subject} from "rxjs";
import {ModalService} from "../../../core/services/shared/modal.service";
import {NGXLogger} from "ngx-logger";
import {EventModal} from "../../../models/interface/EventModal";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent implements OnInit, EventModal, OnDestroy {

  @ViewChild("modalInfo") modalInfo: ModalDirective;

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
    this.logger.info('SHOW MODAL INFO');
    this.modalService.modalInfoEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      showModal => {
        if (showModal) {
          this.messageBody = this.modalService.messageBody;
          this.modalInfo.show();
        } else {
          this.modalInfo.hide();
        }
      }
    )

  }

  emitEventOk() {
    this.modalInfo.hide();
    this.okEvent.emit(true);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
