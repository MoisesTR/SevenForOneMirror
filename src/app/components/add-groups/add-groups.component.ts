import {Component, OnInit} from '@angular/core';
import {GroupService} from '../../core/services/shared/group.service';
import {GroupGame} from '../../models/GroupGame';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Utils} from '../../infraestructura/Utils';

@Component({
  selector: 'app-add-groups',
  templateUrl: './add-groups.component.html',
  styleUrls: ['./add-groups.component.scss']
})
export class AddGroupsComponent implements OnInit {
  group: GroupGame = new GroupGame();
  formAddGroup: FormGroup;
  inhabilitarBoton = false;

  constructor(private groupsService: GroupService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.initFormGroup();
  }


  initFormGroup() {
    this.formAddGroup = this.formBuilder.group({
        monto: new FormControl(0)
        , descripcion: new FormControl('', [Validators.minLength(4), Validators.maxLength(40)])
      }
    );
  }

  crearGrupo() {
    this.inhabilitarBoton = true;
    this.obtenerValores();

    if (this.groupEsValido()) {
      this.groupsService.createGroup(this.group).subscribe(
        response => {
          Utils.showMsgSucces('El grupo ha sido creado');
        }, () => {
          this.inhabilitarBoton = false;
        }, () => {
          this.inhabilitarBoton = false;
        }
      );
    } else {
      this.inhabilitarBoton = false;
    }
  }

  groupEsValido(): boolean {

    if (this.group.initialInvertion <= 0) {
      Utils.showMsgInfo('El monto debe ser mayor a cero!');
      return false;
    }

    return true;
  }

  obtenerValores() {
    this.group.initialInvertion = this.formAddGroup.value.monto;
  }

}
