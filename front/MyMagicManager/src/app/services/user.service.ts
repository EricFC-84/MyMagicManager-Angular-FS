import {
  Injectable
} from '@angular/core';
import {
  ApiService
} from './api.service';
import {
  Router
} from '@angular/router';
import { environment } from '../../environments/environment';


// import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  token: object;

  checkingLogin: boolean = false
  checkedLogin: boolean = false
  isLogged: boolean = false;
  registerFinished: boolean = false;
  registerError: boolean = false;
  loginError:boolean = false;
  loggedUser: object
  currentUser: object;

  constructor(public _api: ApiService, public _router: Router) {}

  isFavourite(cardID: string) {
/*     // console.log("favouriteCards", this.loggedUser["favouriteCards"])
    // console.log("event:", eventID) */
    for (let i = 0; i < this.loggedUser["favouriteCards"].length; i++) {
      if (this.loggedUser["favouriteCards"][i]["_id"] == cardID) return true      
    }
    return false
    // return (this.loggedUser["favouriteCards"].indexOf(cardID) >= 0)
  }

  addToFavourites(favouriteCard: object) {
    
    // let position = this.loggedUser["favouriteCards"].indexOf(favouriteCard["_id"])
    let position = -1;
    for (let i = 0; i < this.loggedUser["favouriteCards"].length; i++) {
      if (this.loggedUser["favouriteCards"][i]["_id"] == favouriteCard["_id"]) {
        position = i
      }      
    }
    if (position < 0) { //not in favourites
      this.loggedUser["favouriteCards"].push(favouriteCard)

    } else {
      this.loggedUser["favouriteCards"].splice(position, 1)
      // console.log("Already in favourites")
    }
    
    return this._api.put(environment.url + "users/", {"_id":this.loggedUser["_id"],"favouriteCards": this.loggedUser["favouriteCards"]},
    {"Authorization": "Bearer " + this.token["token"]})

  }

  checkLogin(): void {
    console.log(this.checkedLogin)
    if (!this.checkedLogin) {
      if (!this.isLogged && !this.checkingLogin) {
        this.token = JSON.parse(localStorage.getItem("MagicToken"))
        if (this.token === null) {
          this.isLogged = false;
          this.checkedLogin = true
        } else {
          //get user data
          this.checkingLogin = true;
          let userId = this.token["id"]
          let url = environment.url + "user/" + userId;      
          this._api.get(url, {
            "Authorization": "Bearer " + this.token["token"]
          }).subscribe((response) => {
            this.loggedUser = {
              ...response['0']
            }
            this.isLogged = true;
            this.checkingLogin = false;
            this.checkedLogin = true
            this._api.stopLoading();
            // console.log(this.loggedUser)    
          })
        }
      }
    }    
  }

  register(newUser: object) {
    this._api.post(environment.url + "register", newUser).subscribe((response) => {
      this._api.stopLoading();

      // console.log(response);
      if (response["status"] == "OK") {
        // this.isLogged = true;
        this.registerFinished = true;
        this.registerError = false;


        this.login(newUser["email"], newUser["password"], true)

        /* this.loggedUser = {...response["userData"]};
        console.log(this.loggedUser)
        this.isLogged = true; 
        this.checkedLogin = true;
        // localStorage.setItem("meetUpRegisterToken",newUser["email"])
        this._router.navigateByUrl("") */
      } else {
        this.registerError = true;
        console.log(response)
      }
    })
  }

  login(email: string, password: string, guardarSesion: boolean) {
    this.loginError = false;
    let body = {
      email: email,
      password: password
    }
    this._api.post(environment.url + "login", body).subscribe((response) => {
      this._api.stopLoading();

      // console.log(response);
      if (response["status"] == "OK") {
        // console.log("login OK!!")
        if (guardarSesion) {  
          // console.log(response)
          this.token = {
            "id": response["userId"],
            // "name": response.userData["name"],
            // "email": response.userData["email"],
            "token": response["token"]
          }
          localStorage.setItem("MagicToken", JSON.stringify(this.token))
        }
        this.isLogged = true;
        this.loggedUser = response["user"]
        this._router.navigateByUrl("/")
        // console.log(this.loggedUser)
      } else {
        this.loginError = true;
      }
    })
  }


  logout() {
    localStorage.removeItem("MagicToken");
    this.loggedUser = {};
    this.isLogged = false;
    this.checkedLogin = true;
    //TO DO: go to home and reload so Auth jumps automatically
    this._router.navigateByUrl("");
  }

  getProfileData(userId) {
    let url = environment.url + "user/" + userId;
    // console.log("userURL:", url)
      return this._api.get(url/* , {
        "Authorization": "Bearer " + this.token["token"]
      } */)
  }

  formatDateProfile(){
    // this.currentUser["creationDateFormatted"] = moment(this.currentUser["creationDate"]).format('DD/MM/YYYY')
    
}

  editProfile(body){
    return this._api.put(environment.url + "users", body, {
      "Authorization": "Bearer " + this.token["token"]
    })
  }

}
