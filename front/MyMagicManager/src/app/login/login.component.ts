import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailLogin: string = "";
  passwordLogin: string = "";
  guardarSesion: boolean = true;

  login() {

    // console.log("email:",this.emailLogin)
    // console.log("pass:", this.passwordLogin)
    if (this.emailLogin != "" && this.passwordLogin != ""){
      this._user.login(this.emailLogin, this.passwordLogin, this.guardarSesion)
    } 
  }

  constructor(public _user:UserService) { }

  ngOnInit() {
    if (this._user.registerFinished){
      // this.emailLogin = localStorage.getItem("meetUpRegisterToken")
      // localStorage.removeItem("meetUpRegisterToken")
      this.emailLogin = this._user.loggedUser["email"]
      this.passwordLogin = this._user.loggedUser["password"]
      this._user.registerFinished = false;
    }
  }

}
