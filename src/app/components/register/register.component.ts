import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"; 
import { User } from "../../models/models.index";
import { Utils } from "../Utils";
import { CustomValidators } from "../../validators/CustomValidators";
import deepEqual from 'deep-equal';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public user:User;
  public telefonos: string[] = [];
  public Compare: boolean;
  formRegisterUser: FormGroup;

  
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.user = new User();
   }

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

    $(document).ready(() => {
			$(".letras").keypress(function(key) {
				if (
					(key.charCode < 97 || key.charCode > 122) && // letras mayusculas
					(key.charCode < 65 || key.charCode > 90) && // letras minusculas
					key.charCode !== 241 && // ñ
					key.charCode !== 209 && // Ñ
					key.charCode !== 32 && // espacio
					key.charCode !== 225 && // á
					key.charCode !== 233 && // é
					key.charCode !== 237 && // í
					key.charCode !== 243 && // ó
					key.charCode !== 250 && // ú
					key.charCode !== 193 && // Á
					key.charCode !== 201 && // É
					key.charCode !== 205 && // Í
					key.charCode !== 211 && // Ó
					key.charCode !== 218 // Ú
				) {
					return false;
				}
			});
		});

    this.initFormRegisterUser();
  }

  private initFormRegisterUser(){
    this.formRegisterUser = this.formBuilder.group({

      user: new FormControl('',[
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40),
        CustomValidators.nospaceValidator
      ]),
      password: new FormControl('',[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
        CustomValidators.nospaceValidator
      ]),

      confirmPassword: new FormControl('',[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
        CustomValidators.nospaceValidator
      ]),

      email: new FormControl('',[
        Validators.required
      ]),

      firstNames: new FormControl('',[
        Validators.required,
        Validators.minLength(3),
				Validators.maxLength(150)
      ]),

      lastName: new FormControl('',[
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ]),
      
      phone: new FormControl('',[
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(25)
      ]),
      gender: new FormControl('',[Validators.required]),
      birthday: new FormControl('',[Validators.required])

      })
  }


  getValueForm(){
    this.user.userName = this.formRegisterUser.value.user;
    this.user.password = this.formRegisterUser.value.password;
    this.user.firstName = this.formRegisterUser.value.firstNames;
    this.user.lastName = this.formRegisterUser.value.lastName
    this.telefonos.push(this.formRegisterUser.value.phone)
    this.user.phones = this.telefonos;
    this.user.gender = this.formRegisterUser.value.gender 
    this.user.birthDate = Utils.formatDateYYYYMMDD(this.formRegisterUser.value.birthday);
    this.user.role = "5c5de2211d65b81ce0497480";
    
    if(this.Compare){
      this.user.password = this.formRegisterUser.value.password;
    }
  }

  createdUser(){
    this.getValueForm();
    }

  probarCambio(confirmPassword){
    //devuelve true si es correcto
    this.Compare = deepEqual(this.formRegisterUser.value.password,confirmPassword);
    return this.Compare;
  }
}
