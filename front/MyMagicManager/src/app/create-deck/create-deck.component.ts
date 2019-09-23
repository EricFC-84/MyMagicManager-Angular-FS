import {
  Component,
  OnInit
} from '@angular/core';
import {
  DataService
} from '../services/data.service';
import {
  UserService
} from '../services/user.service';
import {
  Router
} from '@angular/router';



@Component({
  selector: 'app-create-deck',
  templateUrl: './create-deck.component.html',
  styleUrls: ['./create-deck.component.css']
})
export class CreateDeckComponent implements OnInit {
  cardName: string = ""



  showHover: boolean[] = []



  mouseX: number = 0;
  mouseY: number = 0;
  detailsView: boolean = false;

  currentCardMana = [];




  deckName: String = "";
  publicDeck = true;

  constructor(public _data: DataService, public _user: UserService, public _router: Router) {
    _data.filteredCards = [];
    if (_data.currentView == "edit-deck" || _data.currentView == "clone-deck") {
      // console.log(_data.currentDeckDetails)
      for (let i = 0; i < _data.currentDeckDetails["cards"].length; i++) {
        _data.filteredCards.push(_data.currentDeckDetails["cards"][i]["card"])
      }
      this.deckName = _data.currentDeckDetails["name"]
      this.publicDeck = _data.currentDeckDetails["public"]
    } else {
      _data.deckCards = [];
      _data.currentView = "create-deck"


    }
    // if (!_user.isLogged) _user.checkLogin()

  }

  ngOnInit() {


    // this.refreshSelectpickers();
    /* let deckBaseName = 0;
    for (let i = 0; i < this._user.loggedUser["createdDecks"].length; i++) {
      if (this._user.loggedUser["createdDecks"]["i"]["name"].indexOf("New Deck") >= 0) {
        deckBaseName++
      }
    }
    if (deckBaseName > 0) {
      this.deckName = "NewDeck_" + this._user.loggedUser["createdDecks"].length;
    } else {
      this.deckName = "NewDeck"
    } */
  }


  onMouseMove(e) {

    //Mostrar imagen a izq del cursor si la carta sobrepasa el ancho de pantalla
    if ((e.clientX + 25 + 293) > window.innerWidth) {
      this.mouseX = e.offsetX - 25 - 293
    } else {
      this.mouseX = e.offsetX + 25;
    }
    //En vertical, siempre se mostrará debajo. TO DO: según alto de footer, comprobar y hacer que se muestre arriba si llega al final del componente y lo sobrepasa
    this.mouseY = e.offsetY + 18;
  }




  addToDeck(selectedCard: number) {
    let alreadyInDeck = false;
    for (let i = 0; i < this._data.deckCards.length; i++) {
      // console.log(this._data.deckCards[i]["card"])

      if (this._data.deckCards[i]["card"]["name"] == this._data.filteredCards[selectedCard]["name"] && this._data.deckCards[i]["card"]["type_line"].indexOf("Basic Land") < 0) {
        if (this._data.deckCards[i]["count"] < 4) {
          this._data.deckCards[i]["count"]++
          this._data.deckCardsCount++
        }
        alreadyInDeck = true
      } else if (this._data.deckCards[i]["card"]["name"] == this._data.filteredCards[selectedCard]["name"] && this._data.deckCards[i]["card"]["type_line"].indexOf("Basic Land") >= 0) {
        this._data.deckCards[i]["count"]++
        this._data.deckCardsCount++
        alreadyInDeck = true
      }
    }
    if (!alreadyInDeck) {
      this._data.deckCardsCount++;
      this._data.deckCards.push({
        "count": 1,
        "card": this._data.filteredCards[selectedCard],
        "color_identity": this.checkColorIdentity(this._data.filteredCards[selectedCard]["color_identity"])
      })
      this._data.deckCards.sort(function (a, b) {
        var costA = a["card"]["cmc"],
          costB = b["card"]["cmc"];
        // Compare the 2 dates
        if (costA < costB) return -1;
        if (costA > costB) return 1;
        return 0;
      });
    }

  }


  removeFromDeck(event, selectedCard: number) {
    event.preventDefault();
    // console.log(selectedCard)
    for (let i = 0; i < this._data.deckCards.length; i++) {
      if (this._data.deckCards[i]["card"]["name"] == this._data.filteredCards[selectedCard]["name"]) {
        if (this._data.deckCards[i]["count"] == 1) {
          this._data.deckCards.splice(i, 1)
          i--;
        } else {
          this._data.deckCards[i]["count"]--
        }
        this._data.deckCardsCount--
      }
    }
    return false;

  }

  checkColorIdentity(identity: string[]) {
    // console.log(identity)
    // console.log(this._data.deckCards)
    let colors = "";
    // let identity = this._data.deckCards[selectedCard]["card"]["color_identity"];
    if (identity.length == 1) {
      colors = identity[0].toLowerCase()
    } else if (identity.length == 2) {
      identity.sort(function (a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      colors = identity.join().replace(',', '').toLowerCase()

    } else if (identity.length == 0) {
      colors = "c"
    } else {
      colors = "multi"
    }
    return colors;

  }


  saveDeck() {
    let newDeck = {
      "name": this.deckName,
      "cards": [...this._data.deckCards],
      "creator": {
        "_id": this._user.loggedUser["_id"],
        "name": this._user.loggedUser["name"]
      },
      "public": this.publicDeck
    }
    this._data.saveDeck(newDeck);
  }

  updateDeck() {
    let editedDeck = {
      "name": this.deckName,
      "cards": [...this._data.deckCards],
      "creator": {
        "_id": this._user.loggedUser["_id"],
        "name": this._user.loggedUser["name"]
      },
      "public": this.publicDeck,
      "_id": this._data.currentDeckDetails["_id"]
    }
    this._data.updateDeck(editedDeck);
  }

  resetDeck() {
    this._data.deckCards = [];
    this._data.deckCardsCount = 0;
  }

  loadStats(){
    this._data.statsCalculated = false;
    this._data.calcAllStats()
  }
}
