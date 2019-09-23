import {
  Component,
  OnInit
} from '@angular/core';
import {
  UserService
} from '../services/user.service';
import {
  DataService
} from '../services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  nameRegister: string = "";
  emailRegister: string = "";
  passwordRegister: string = "";


  inputErrors: object = {
    "name": false,
    "email": false,
    "password": false,
    "alreadyExists": false
  }

  profilePics: string[];
  selectedPic: string = "0";
  hasConfirmedPic: boolean = false;

  validInputs = {
    "name": false,
    "email": false,
    "password": false
  }

  validating: boolean = false;

  checkRegistryData(): boolean {

    let emailCorrect = this.validateEmail();
    let nameCorrect = this.validateName();
    let passwordCorrect = this.validatePassword();

    this.inputErrors = {
      "name": !nameCorrect,
      "email": !emailCorrect,
      "password": !passwordCorrect
    }

    if (!emailCorrect || !nameCorrect || !passwordCorrect) {
      return false;
    } else {
      return true;
    }

  }

  validatePassword() {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/.test(this.passwordRegister)) {
      this.validInputs["password"] = true;
      return (true)
    } else {

      // console.log("You have entered an invalid password!")
      this.validInputs["password"] = false;
      return (false)
    }
  }


  validateName() {
    if (/^(?=.{8,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$/.test(this.nameRegister)) {
      this.validInputs["name"] = true;
      return (true)
    } else {

      // console.log("You have entered an invalid name!")
      this.validInputs["name"] = false;
      return (false)
    }
  }

  validateEmail() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.emailRegister)) {
      this.validInputs["email"] = true;
      return (true)
    } else {

      // console.log("You have entered an invalid email address!")
      this.validInputs["email"] = false;
      return (false)
    }
  }

  register() {

    this.validating = true;
    if (this.checkRegistryData()) {
      this.validating = false;

      let newUser = {
        name: this.nameRegister,
        email: this.emailRegister,
        password: this.passwordRegister,
        profileImage: this.profilePics[parseInt(this.selectedPic) - 1]
      }
      // console.log(newUser)
      this._user.register(newUser)
    }
  }
  constructor(public _user: UserService, public _data: DataService) {
    let i = 0;
    this.profilePics = Array(46).fill(i).map((x, i) => `../../assets/Planeswalkers/${i+1}.png`); // [0,1,2,3,4]
    // console.log(this.profilePics)
  }

  ngOnInit() {}


  selectPic(i) {
    this.selectedPic = i;
  }

  confirmedPic(i) {
    this.hasConfirmedPic = true;
  }
}
