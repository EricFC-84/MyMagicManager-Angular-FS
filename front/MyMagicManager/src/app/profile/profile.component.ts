import {
  Component,
  OnInit
} from '@angular/core';
import {
  UserService
} from '../services/user.service';
import {
  ActivatedRoute,
  Router
} from "@angular/router";
import {
  DataService
} from '../services/data.service';
import {
  DomSanitizer,
  SafeHtml,
  SafeUrl
} from '@angular/platform-browser';
import { ApiService } from '../services/api.service';

declare var $: any


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  exportURL: SafeUrl;

  exportFormat: string = "JSON"
  exportName: string;
  csvFile: string = "";

  constructor(public _user: UserService, public _activeRoute: ActivatedRoute, public _data: DataService, public _router: Router, public sanitizer: DomSanitizer, public _api:ApiService) {

    // if (!_user.isLogged && !_user.checkingLogin) _user.checkLogin()
    this._data.currentView = "profile"

  }

  ngOnInit() {
    let interval = setInterval(() => {
      // console.log("interval")
      if (this._user.checkedLogin) {
        clearInterval(interval)
        if (this._user.isLogged && this._activeRoute.params["_value"]["id"] == this._user.loggedUser["_id"]) {
          this._user.currentUser = {
            ...this._user.loggedUser
          }
          console.log
          this._user.currentUser["publicDecks"] = [...this._user.loggedUser["createdDecks"]];
          this._data.filteredCards = this._user.currentUser["favouriteCards"]

        } else {
          this._user.getProfileData(this._activeRoute.params["_value"]["id"]).subscribe((response) => {
            // console.log("response", response)
            this._user.currentUser = {
              ...response['0']
            }
            let publicDecks = []

            for (let i = 0; i < this._user.currentUser["createdDecks"].length; i++) {
              if (this._user.currentUser["createdDecks"][i]["public"] == true) {
                publicDecks.push(this._user.currentUser["createdDecks"][i])
              }
            }

            this._user.currentUser["publicDecks"] = publicDecks;
            // this._user.formatDateProfile()
            this._user._api.stopLoading();
            // console.log("currentUSer", this._user.currentUser)
            this._data.filteredCards = this._user.currentUser["favouriteCards"]
            $('.selectpicker').selectpicker("val", "JSON")


          })
        }
      }
    }, 100)



  }
  loadDeck(i) {
    this._data.currentDeckDetails = this._user.currentUser["publicDecks"][i];
    this._data.deckCards = [...this._data.currentDeckDetails["cards"]]
    this._router.navigateByUrl("/deck/" + this._user.currentUser["publicDecks"][i]["_id"])
  }

  deleteDeck(i){
    this._data.deleteDeck(this._user.currentUser["publicDecks"][i]["_id"], this._user.currentUser["publicDecks"][i]["creator"]["_id"]).subscribe((response) => {
      // if (response["status"] == "OK"){
        // console.log(response)
        this._user.currentUser["publicDecks"].splice(i, 1)
        this._api.stopLoading()
      // } 
    })
  }

  
  loadStats(i){
    this._data.deckCards = this._user.currentUser['publicDecks'][i]["cards"]
    this._data.statsCalculated = false;
    this._data.calcAllStats()
  }

  exportDeck(i) {
    $('.selectpicker').selectpicker("val", "JSON")

    this.exportName = this._user.currentUser['publicDecks'][i]["name"]
    this.downLoadFile(JSON.stringify(this._user.currentUser['publicDecks'][i]), "octet/stream")
    this._data.currentDeckDetails = this._user.currentUser['publicDecks'][i]
    this.generateCSV()
  }


/*   convertToCSV(objArray) {
    // console.log(objArray)
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ';'

        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  } */

  generateCSV() {
    let deckToExport = this._data.currentDeckDetails;
    let keys = Object.keys(deckToExport)
    // console.log(deckToExport)
    // console.log(keys);
    /* for (let i = 0; i < deckToExport["cards"].length; i++) {
      // console.log(deckToExport["cards"][i])
      this.csvFile += this.convertToCSV(JSON.stringify(deckToExport["cards"][i]["card"]))  
    } */
    // this.csvFile += this.convertToCSV(JSON.stringify(deckToExport["cards"]))

    let csvArray = []
    csvArray.push(deckToExport["name"])
    csvArray.push("Author: " + deckToExport["creator"]["name"] + ";")
    csvArray.push("Created on: " + deckToExport["creationDate"] + ";")

    csvArray.push("--------------------")
    csvArray.push("")

    csvArray.push("Count;Name;Set;Color;Rarity;Type;Cost;Text")

    for (let i = 0; i < deckToExport["cards"].length; i++) {
      let cardData = []
      let currentCard = deckToExport["cards"][i]
      // console.log(currentCard["card"])
      cardData.push(currentCard["count"])
      cardData.push(currentCard["card"]["name"])
      cardData.push(currentCard["card"]["set_name"])
      cardData.push(currentCard["card"]["colors"].join(','))
      cardData.push(currentCard["card"]["rarity"])
      cardData.push(currentCard["card"]["type_line"].replace(/—/g, "-"))
      if (currentCard["card"]["card_faces"].length > 0) {
        cardData.push(currentCard["card"]["card_faces"][0]["mana_cost"].replace(/{/g, "").replace(/}/g, "") + " // " + currentCard["card"]["card_faces"][1]["mana_cost"].replace(/{/g, "").replace(/}/g, ""))
        cardData.push('"' + currentCard["card"]["card_faces"][0]["oracle_text"].replace(/;/g, "--") + " // " + currentCard["card"]["card_faces"][1]["oracle_text"].replace(/;/g, "--") + '"')
      } else {
        cardData.push(currentCard["card"]["mana_cost"])
        cardData.push('"' + currentCard["card"]["oracle_text"].replace(/;/g, "--") + '"')
      }

      csvArray.push(cardData.join(';'))
    }
    this.csvFile = csvArray.join("\r\n")
    // console.log(this.csvFile);

    // this.downLoadFile(this.csvFile, "octet/stream")
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], {
      type: type
    });
    this.exportURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob))
    /* let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    } */
  }

  changeFormat(){
    if(this.exportFormat == "JSON") {
      this.downLoadFile(JSON.stringify(this._data.currentDeckDetails), "octet/stream")
    } else {
      console.log ("CSV!")
      this.downLoadFile(this.csvFile, "octet/stream")
    }
  }



  editDeck(i) {
    this._data.currentDeckDetails = this._user.currentUser["publicDecks"][i];
    this._data.deckCards = [...this._data.currentDeckDetails["cards"]]
    for (let i = 0; i < this._data.currentDeckDetails["cards"].length; i++) {
      this. _data.deckCardsCount += this._data.currentDeckDetails["cards"][i]["count"]
    }
    this._data.currentView = "edit-deck"
    this._router.navigateByUrl("/edit-deck/" + this._data.currentDeckDetails["_id"])
  }

  cloneDeck(i) {
    this._data.currentDeckDetails = this._user.currentUser["publicDecks"][i];
    this._data.deckCards = [...this._data.currentDeckDetails["cards"]]
    for (let i = 0; i < this._data.currentDeckDetails["cards"].length; i++) {
      this. _data.deckCardsCount += this._data.currentDeckDetails["cards"][i]["count"]
    }
    this._data.currentView = "clone-deck"
    this._router.navigateByUrl("/create-deck")
  }
}
