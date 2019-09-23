import {
  Component,
  OnInit
} from '@angular/core';
import { DataService } from '../services/data.service';





@Component({
  selector: 'app-search-cards',
  templateUrl: './search-cards.component.html',
  styleUrls: ['./search-cards.component.css']
})
export class SearchCardsComponent implements OnInit {


  constructor(public _data:DataService) {
    // this.refreshSelectpickers();
    // $('.selectpicker').selectpicker('refresh')
    this._data.currentView = "search-cards"

 
    _data.filteredCards = [];
  }

  ngOnInit() {

  }



}

