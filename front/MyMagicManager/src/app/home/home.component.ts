import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import {
  DomSanitizer,
  SafeHtml,
  SafeUrl
} from '@angular/platform-browser';

declare var $: any


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  exportURL: SafeUrl;

  exportFormat: string = "JSON"
  exportName: string;
  csvFile: string = ""


  constructor(public _data:DataService, public _router:Router, public sanitizer: DomSanitizer) { 
    _data.getPublicDecks()
    _data.getFavourites()
    this._data.currentView = "home"
  }

  ngOnInit() {
  }

  loadDeck(i) {
    this._data.currentDeckDetails = this._data.publicDecks[i];
    this._data.deckCards = [...this._data.currentDeckDetails["cards"]]
    this._router.navigateByUrl("/deck/" + this._data.publicDecks[i]["_id"])
  }

  loadStats(i){
    this._data.deckCards = this._data.publicDecks[i]["cards"]
    this._data.statsCalculated = false;
    this._data.calcAllStats()
    
  }

  exportDeck(i) {
    $('.selectpicker').selectpicker("val", "JSON")

    this.exportName = this._data.publicDecks[i]["name"]
    this.downLoadFile(JSON.stringify(this._data.publicDecks[i]), "octet/stream")
    this._data.currentDeckDetails = this._data.publicDecks[i]

    this.generateCSV()
  }

  generateCSV() {
    let deckToExport = this._data.currentDeckDetails;
    let keys = Object.keys(deckToExport)

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
    this._data.currentDeckDetails = this._data.publicDecks[i];
    this._data.deckCards = [...this._data.currentDeckDetails["cards"]]
    for (let i = 0; i < this._data.currentDeckDetails["cards"].length; i++) {
      this. _data.deckCardsCount += this._data.currentDeckDetails["cards"][i]["count"]
    }
    this._data.currentView = "edit-deck"
    this._router.navigateByUrl("/edit-deck/" + this._data.currentDeckDetails["_id"])
  }

  cloneDeck(i) {
    this._data.currentDeckDetails = this._data.publicDecks[i];
    this._data.deckCards = [...this._data.currentDeckDetails["cards"]]
    for (let i = 0; i < this._data.currentDeckDetails["cards"].length; i++) {
      this. _data.deckCardsCount += this._data.currentDeckDetails["cards"][i]["count"]
    }
    this._data.currentView = "clone-deck"
    this._router.navigateByUrl("/create-deck")
  }

  resetStats(){
    console.log("reseting");
    
    this._data.statsCalculated = false;
    this._data.resetAllStats()
  }

}
