import { Component, OnInit } from '@angular/core';
import {
  DataService
} from '../services/data.service';

import {
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';

import { UserService } from '../services/user.service';

declare var $: any

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  cardName: string = ""
  
  showHover: boolean[] = []



  mouseX: number = 0;
  mouseY: number = 0;
  detailsView: boolean = false;

  currentCardMana = [];


  safeHtml: SafeHtml;
  constructor(public _data: DataService, private sanitizer: DomSanitizer, public _user:UserService) { }

  ngOnInit() {
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

  generateManaCost() {
    this.currentCardMana = []
    if (this._data.currentCardDetails["layout"] != "transform" && this._data.currentCardDetails["mana_cost"].length > 0) {
      this.currentCardMana = this._data.replaceManaText(this._data.currentCardDetails)
    } else if (this._data.currentCardDetails["card_faces"].length > 0) {
      this.currentCardMana = this._data.replaceManaText(this._data.currentCardDetails["card_faces"][0])
    }

    // console.log("currentCost", this.currentCardMana)

  }

 

  generateOracleTextIcons() {
    let oracleText = "";
    if (this._data.currentCardDetails["layout"] == "split" || this._data.currentCardDetails["layout"] == "transform"){
      oracleText = this._data.currentCardDetails["card_faces"][0]["oracle_text"].replace(/{X}/g, "<i class='ms ms-x ms-shadow ms-cost'></i>").replace(/{T}/g, "<i class='ms ms-tap ms-shadow ms-cost'></i>").replace(/{B}/g, "<i class='ms ms-b ms-shadow ms-cost'></i>").replace(/{U}/g, "<i class='ms ms-u ms-shadow ms-cost'></i>").replace(/{G}/g, "<i class='ms ms-g ms-shadow ms-cost'></i>").replace(/{R}/g, "<i class='ms ms-r ms-shadow ms-cost'></i>").replace(/{W}/g, "<i class='ms ms-w ms-shadow ms-cost'></i>").replace(/{C}/g, "<i class='ms ms-c ms-shadow ms-cost'></i>").replace(/{/g, "<i class='ms ms-shadow ms-cost ms-").replace(/}/g, "'></i>").replace(/\n/g, "<br>") /* .replace(/\.\)/g,").").replace(/\./g, ".<br>") */
      oracleText += "<hr>" + this._data.currentCardDetails["card_faces"][1]["oracle_text"].replace(/{X}/g, "<i class='ms ms-x ms-shadow ms-cost'></i>").replace(/{T}/g, "<i class='ms ms-tap ms-shadow ms-cost'></i>").replace(/{B}/g, "<i class='ms ms-b ms-shadow ms-cost'></i>").replace(/{U}/g, "<i class='ms ms-u ms-shadow ms-cost'></i>").replace(/{G}/g, "<i class='ms ms-g ms-shadow ms-cost'></i>").replace(/{R}/g, "<i class='ms ms-r ms-shadow ms-cost'></i>").replace(/{W}/g, "<i class='ms ms-w ms-shadow ms-cost'></i>").replace(/{C}/g, "<i class='ms ms-c ms-shadow ms-cost'></i>").replace(/{/g, "<i class='ms ms-shadow ms-cost ms-").replace(/}/g, "'></i>").replace(/\n/g, "<br>") /* .replace(/\.\)/g,").").replace(/\./g, ".<br>") */
    // } else if (this._data.currentCardDetails["layout"] == "transform") {
      if (this._data.currentCardDetails["card_faces"][0]["flavor_text"] && this._data.currentCardDetails["card_faces"][1]["flavor_text"] ) {

        this._data.currentCardDetails["flavor_text"] = this._data.currentCardDetails["card_faces"][0]["flavor_text"] + "\n" + this._data.currentCardDetails["card_faces"][1]["flavor_text"]
      } else if (this._data.currentCardDetails["card_faces"][0]["flavor_text"] && !this._data.currentCardDetails["card_faces"][1]["flavor_text"]) {
        this._data.currentCardDetails["flavor_text"] = this._data.currentCardDetails["card_faces"][0]["flavor_text"]
      } else if (!this._data.currentCardDetails["card_faces"][0]["flavor_text"] && this._data.currentCardDetails["card_faces"][1]["flavor_text"]) {
        this._data.currentCardDetails["flavor_text"] = this._data.currentCardDetails["card_faces"][1]["flavor_text"]

      }
    }
    else {
      oracleText = this._data.currentCardDetails["oracle_text"].replace(/{X}/g, "<i class='ms ms-x ms-shadow ms-cost'></i>").replace(/{T}/g, "<i class='ms ms-tap ms-shadow ms-cost'></i>").replace(/{B}/g, "<i class='ms ms-b ms-shadow ms-cost'></i>").replace(/{U}/g, "<i class='ms ms-u ms-shadow ms-cost'></i>").replace(/{G}/g, "<i class='ms ms-g ms-shadow ms-cost'></i>").replace(/{R}/g, "<i class='ms ms-r ms-shadow ms-cost'></i>").replace(/{W}/g, "<i class='ms ms-w ms-shadow ms-cost'></i>").replace(/{C}/g, "<i class='ms ms-c ms-shadow ms-cost'></i>").replace(/{/g, "<i class='ms ms-shadow ms-cost ms-").replace(/}/g, "'></i>").replace(/\n/g, "<br>") /* .replace(/\.\)/g,").").replace(/\./g, ".<br>") */

    }
    if (this._data.currentCardDetails["type_line"].indexOf("Planeswalker") >= 0) {
      // console.log("Planeswaler!!")
      let loyalty_regex_minus = /\−(\d+|X)\:/g
      let loyalty_regex_plus = /\+\d+\:/g

      let results;
      let planeswalker_text = []
      while ((results = loyalty_regex_minus.exec(oracleText)) !== null) {
        planeswalker_text.push({
          "index": results['index'],
          "length": results[0].length
        })
        var msg = 'Found ' + results[0] + " at index " + results['index'] + '. ';
        msg += 'Next match starts at ' + loyalty_regex_minus.lastIndex;
        // console.log(msg);
      }

      for (let i = planeswalker_text.length - 1; i >= 0; i--) {
        let index = planeswalker_text[i]["index"];
        let length = planeswalker_text[i]["length"];
        let new_text = oracleText.substr(0, index) + '<i class="ms ms-loyalty-down ms-loyalty-' + oracleText.substr(index + 1, length - 2).toLowerCase() + '"></i>:' + oracleText.substr(index + length, oracleText.length)
        oracleText = new_text

      }

      planeswalker_text = []
      while ((results = loyalty_regex_plus.exec(oracleText)) !== null) {
        planeswalker_text.push({
          "index": results['index'],
          "length": results[0].length
        })
        var msg = 'Found ' + results[0] + " at index " + results['index'] + '. ';
        msg += 'Next match starts at ' + loyalty_regex_plus.lastIndex;
        // console.log(msg);
      }

      for (let i = planeswalker_text.length - 1; i >= 0; i--) {
        let index = planeswalker_text[i]["index"];
        let length = planeswalker_text[i]["length"];
        let new_text = oracleText.substr(0, index) + '<i class="ms ms-loyalty-up ms-loyalty-' + oracleText.substr(index + 1, length - 2) + '"></i>:' + oracleText.substr(index + length, oracleText.length)
        oracleText = new_text

      }

    }
    // console.log(oracleText)

    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
      oracleText
    )

  }

  showCardDetails(i) {

    this._data.currentCardDetails = this._data.filteredCards[i];
    // console.log("current", this._data.currentCardDetails)

    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
      ""
    )
    this.generateManaCost()

    this.generateOracleTextIcons()


    this.detailsView = true;
  }

  addToFavourites(){
    this._data.addToFavourites(this._data.currentCardDetails)
  }


}
