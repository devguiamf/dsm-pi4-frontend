import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { catchError, of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { UtilService } from 'src/util/util.service';
import { StorageService } from 'src/util/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  password: string = 'password';
  form!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private dialog: MatDialog,
    private utilService: UtilService,
    private storageService: StorageService

  ) { }

  ngOnInit(): void {
    this.initialForms();
  }

  initialForms(){
    this.form = this.fb.group({
      email: ['gui@gmail.com', [Validators.required, Validators.email]],
      password: ['123321', [Validators.required, Validators.minLength(6)]]
    })
  }

  getFormsErros(control: string){
    if(this.form.controls[control].hasError('required')){
      return 'Campo obrigatório'
    }
    if(this.form.controls[control].hasError('email')){
      return 'Email invalido'
    }
    return
  }

  async login(){

    const payload ={
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
    }

    await this.loginService.loginSubbimit(payload).pipe(
      catchError(err => {        
        this.utilService.showError(err.error.msg)
        return throwError(() => err)})
    )
    .subscribe(data => {      
      this.setLocalStorage(data)
      this.singIn()
    })

  }

  setLocalStorage(user: any){
    console.log(user);
    
    this.storageService.setEmail(user.user)
    this.storageService.setName(user.name)
    this.storageService.setToken(user.token)
    this.storageService.setId(user.id)
  }

  singIn(){
    this.router.navigate(['home'])
  }

  openDialogRegister(){
    this.dialog.open(RegisterComponent, {
      width: '400px',
      height: '450px'
    })
  }

}
