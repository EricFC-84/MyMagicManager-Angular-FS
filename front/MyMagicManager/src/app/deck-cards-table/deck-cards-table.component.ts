import {
  Component,
  OnInit
} from '@angular/core';
import {
  DataService
} from '../services/data.service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

@Component({
  selector: 'app-deck-cards-table',
  templateUrl: './deck-cards-table.component.html',
  styleUrls: ['./deck-cards-table.component.css']
})
export class DeckCardsTableComponent implements OnInit {

  constructor(public _data: DataService) {}

  ngOnInit() {}

  addToDeckTable(selectedCard: number) {
    // console.log(this._data.currentView)
    if (this._data.currentView == "create-deck" || this._data.currentView == "edit-deck") {
      if (this._data.deckCards[selectedCard]["card"]["type_line"].indexOf("Basic Land") < 0) {
        if (this._data.deckCards[selectedCard]["count"] < 4) {
          this._data.deckCards[selectedCard]["count"]++
          this._data.deckCardsCount++
        }

      } else if (this._data.deckCards[selectedCard]["card"]["type_line"].indexOf("Basic Land") >= 0) {
        this._data.deckCards[selectedCard]["count"]++
        this._data.deckCardsCount++
      }
    }
  }

  removeFromDeckTable(event, selectedCard: number) {
    event.preventDefault();
    if (this._data.currentView == "create-deck" || this._data.currentView == "edit-deck") {
      if (this._data.deckCards[selectedCard]["count"] == 1) {
        this._data.deckCards.splice(selectedCard, 1)
      } else {
        this._data.deckCards[selectedCard]["count"]--
      }
      this._data.deckCardsCount--;
    }
    return false;
  }

}
