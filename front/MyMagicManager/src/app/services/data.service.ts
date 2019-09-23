import {
  Injectable
} from '@angular/core';
import {
  ApiService
} from './api.service';
import {
  UserService
} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  set_names: string[] = ["Ixalan (XLN)", "Rivals of Ixalan (RIX)", "Dominaria (DOM)",
    "Core Set 2019 (M19)", "Guilds of Ravnica (GRN)", "Ravnica Allegiance (RNA)",
    "War of the Spark (WAR)", "Core Set 2020 (M20)"
  ]

  sets: string[] = ["xln", "rix", "dom", "m19", "grn", "rna", "war", "m20"]
  types: string[] = ["Artifact", "Creature", "Enchantment", "Instant", "Land", "Planeswalker", "Sorcery"]
  color_names: string[] = ["Black", "Blue", "Green", "Red", "White", "Colorless"]
  color_codes: string[] = ["B", "U", "G", "R", "W", "C"]
  creature_types: string[] = [
    "Advisor", "Aetherborn", "Ally", "Angel", "Antelope", "Ape", "Archer", "Archon", "Army", "Artificer", "Assassin", "Assembly - Worker", "Atog", "Aurochs", "Avatar", "Azra", "Badger", "Barbarian", "Basilisk", "Bat", "Bear", "Beast", "Beeble", "Berserker", "Bird", "Blinkmoth", "Boar", "Bringer", "Brushwagg", "Camarid", "Camel", "Caribou", "Carrier", "Cat", "Centaur", "Cephalid", "Chimera", "Citizen", "Cleric", "Cockatrice", "Construct", "Coward", "Crab", "Crocodile", "Cyclops", "Dauthi", "Demon", "Deserter", "Devil", "Dinosaur", "Djinn", "Dragon", "Drake", "Dreadnought", "Drone", "Druid", "Dryad", "Dwarf", "Efreet", "Egg", "Elder", "Eldrazi", "Elemental", "Elephant", "Elf", "Elk", "Eye",
    "Faerie", "Ferret", "Fish", "Flagbearer", "Fox", "Frog", "Fungus", "Gargoyle", "Germ", "Giant", "Gnome", "Goat", "Goblin", "God", "Golem", "Gorgon", "Graveborn", "Gremlin", "Griffin", "Hag", "Harpy", "Hellion", "Hippo", "Hippogriff", "Homarid", "Homunculus", "Horror", "Horse", "Hound", "Human", "Hydra", "Hyena", "Illusion", "Imp", "Incarnation", "Insect", "Jackal", "Jellyfish", "Juggernaut", "Kavu", "Kirin", "Kithkin", "Knight", "Kobold", "Kor", "Kraken", "Lamia", "Lammasu", "Leech", "Leviathan", "Lhurgoyf", "Licid", "Lizard", "Manticore", "Masticore", "Mercenary", "Merfolk", "Metathran", "Minion", "Minotaur", "Mole", "Monger", "Mongoose", "Monk", "Monkey", "Moonfolk", "Mutant", "Myr", "Mystic", "Naga", "Nautilus", "Nephilim", "Nightmare", "Nightstalker", "Ninja", "Noggle", "Nomad", "Nymph", "Octopus", "Ogre", "Ooze", "Orb", "Orc", "Orgg", "Ouphe",
    "Ox", "Oyster", "Pangolin", "Pegasus", "Pentavite", "Pest", "Phelddagrif", "Phoenix", "Pilot", "Pincher", "Pirate", "Plant", "Praetor", "Prism", "Processor", "Rabbit", "Rat", "Rebel", "Reflection", "Rhino", "Rigger", "Rogue", "Sable", "Salamander", "Samurai", "Sand", "Saproling", "Satyr", "Scarecrow", "Scion", "Scorpion", "Scout", "Sculpture", "Serf", "Serpent", "Servo", "Shade", "Shaman", "Shapeshifter", "Sheep", "Siren", "Skeleton", "Slith", "Sliver", "Slug", "Snake", "Soldier", "Soltari", "Spawn", "Specter", "Spellshaper", "Sphinx", "Spider", "Spike", "Spirit", "Splinter", "Sponge", "Squid", "Squirrel", "Starfish", "Surrakar", "Survivor", "Tetravite",
    "Thalakos", "Thopter", "Thrull", "Treefolk", "Trilobite", "Triskelavite", "Troll", "Turtle", "Unicorn", "Vampire", "Vedalken", "Viashino", "Volver", "Wall", "Warrior", "Weird", "Werewolf", "Whale", "Wizard", "Wolf", "Wolverine", "Wombat", "Worm", "Wraith", "Wurm", "Yeti", "Zombie", "Zubera "
  ]
  cards_costs: number[];

  filteredCards: object[] = []
  currentCardDetails: object;
  currentDeckDetails: object;
  publicDecks: object[] = [];


  currentView = "";

  deckCards = []
  deckCardsCount = 0;

  /* STATISTICS */

  statsColors = {
    "B": 0,
    "U": 0,
    "G": 0,
    "R": 0,
    "W": 0,
    "C": 0
  }

  statsCosts = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6+": 0

  }

  statsTypes = {
    "creature": 0,
    "artifact": 0,
    "sorcery": 0,
    "planeswalker": 0,
    "instant": 0,
    "enchantment": 0,
    "land": 0
  }

  statsRarities = {
    "common": 0,
    "uncommon": 0,
    "rare": 0,
    "mythic": 0
  }

  statsSets = {
    "xln": 0,
    "rix": 0,
    "dom": 0,
    "m19": 0,
    "grn": 0,
    "rna": 0,
    "war": 0,
    "m20": 0
  }

  statsTotalPrice = 0;

  statsCalculated: boolean = false;

  constructor(public _api: ApiService, public _user: UserService) {
    let i = 0;
    this.cards_costs = Array(17).fill(i).map((x, i) => i);
  }

  replaceManaText(card: object) {
    // console.log(mana_cost)
    let mana_cost = "";

    if (card["layout"] != "transform" && card["mana_cost"].length > 0) {
      mana_cost = card["mana_cost"]
    } else if (card["card_faces"].length > 0) {
      mana_cost = card["card_faces"][0]["mana_cost"]
    }

    return mana_cost.toLowerCase().replace(/}{/g, "-").replace(/{/g, "").replace(/}/g, "").replace(/\s\/\//g, "-").replace(/\//g, "").replace(/\s/g, "-").split("-")

  }

  fetchDoubleFacedCards() {
    for (let i = 0; i < this.filteredCards.length; i++) {
      if (this.filteredCards[i]["card_faces"].length > 0) {
        this.filteredCards[i]["image_uris"] = this.filteredCards[i]["card_faces"]["image_uris"]
      }
    }
  }

  getFilteredCards(filters, favourites) {
    // console.log("filters")
    // console.log(filters)
    this._api.post("http://localhost:3000/cards", filters).subscribe((response) => {
      this._api.stopLoading()
      for (let i = 0; i < response["data"].length; i++) {
        if (response["data"][i]["layout"] == "transform") {
          // console.log(response["data"][i]["name"])
          response["data"][i]["image_uris"] = response["data"][i]["card_faces"][0]["image_uris"]
        }

      }
      // console.log("favourites", favourites)
      // console.log("logged", this._user.isLogged)
      if (favourites && this._user.isLogged) {
        this.filteredCards = []
        for (let i = 0; i < response["data"].length; i++) {
          for (let j = 0; j < this._user.loggedUser["favouriteCards"].length; j++) {
            if (this._user.loggedUser["favouriteCards"][j]["_id"] == response["data"][i]["_id"]) {
              this.filteredCards.push(response["data"][i])
            }

          }
          /* if (this._user.loggedUser["favouriteCards"].indexOf(response["data"][i]["_id"]) >= 0) {
            this.filteredCards.push(response["data"][i])
          }  */
        }
      } else {
        this.filteredCards = [...response["data"]]
        // console.log("filtered cards:")
        // console.log(this.filteredCards)
      }

      // console.log(this.filteredCards)


    })
  }

  saveDeck(newDeck) {
    this._api.post("http://localhost:3000/deck", newDeck).subscribe((response) => {
      // if (response["status"] == "OK"){
      // console.log(response)
      // } 
      this._api.stopLoading()
      this._user.loggedUser["createdDecks"].push(response["deck"])
    })
  }

  //get deck for details view
  loadDeck(deckID) {
    // console.log("deckID:", deckID)
    return this._api.get("http://localhost:3000/deck/" + deckID)
  }

  // update the deck. "editedDeck" contains deck data + its "_id"
  updateDeck(editedDeck) {
    this._api.put("http://localhost:3000/deck", editedDeck).subscribe((response) => {
      // if (response["status"] == "OK"){
      // console.log(response)
      // } 
      this._api.stopLoading()
    })
  }

  deleteDeck(deckID, userID) {
    return this._api.delete("http://localhost:3000/deck/" + deckID + "-" + userID)
  }

  addToFavourites(favouriteCard: object) {
    this._user.addToFavourites(favouriteCard).subscribe((response) => {
      this._api.stopLoading();
      // console.log(this.loggedUser)
      //TO DO: handle errors

      if (this.currentView == "profile") {
        this.filteredCards = [...this._user.loggedUser["favouriteCards"]]
      }
    })
  }


  /* STATISTICS */


  calcTypes(i) {
    // console.log ("deckCards", this.deckCards[i]["card"]["type_line"])

    if (this.deckCards[i]["card"]["type_line"].indexOf("Creature") >= 0) this.statsTypes["creature"] += this.deckCards[i]["count"]
    if (this.deckCards[i]["card"]["type_line"].indexOf("Artifact") >= 0) this.statsTypes["artifact"] += this.deckCards[i]["count"]
    if (this.deckCards[i]["card"]["type_line"].indexOf("Sorcery") >= 0) this.statsTypes["sorcery"] += this.deckCards[i]["count"]
    if (this.deckCards[i]["card"]["type_line"].indexOf("Planeswalker") >= 0) this.statsTypes["planeswalker"] += this.deckCards[i]["count"]
    if (this.deckCards[i]["card"]["type_line"].indexOf("Instant") >= 0) this.statsTypes["instant"] += this.deckCards[i]["count"]
    if (this.deckCards[i]["card"]["type_line"].indexOf("Enchantment") >= 0) this.statsTypes["enchantment"] += this.deckCards[i]["count"]
    if (this.deckCards[i]["card"]["type_line"].indexOf("Land") >= 0) this.statsTypes["land"] += this.deckCards[i]["count"]
  }

  calcRarities(i) {
    switch (this.deckCards[i]["card"]["rarity"]) {
      case "common":
        this.statsRarities["common"] += this.deckCards[i]["count"]
        break;
      case "uncommon":
        this.statsRarities["uncommon"] += this.deckCards[i]["count"]
        break;
      case "rare":
        this.statsRarities["rare"] += this.deckCards[i]["count"]
        break;
      case "mythic":
        this.statsRarities["mythic"] += this.deckCards[i]["count"]
        break;
      default:
        break;
    }
  }

  calcCosts(i) {
    switch (this.deckCards[i]["card"]["cmc"]) {
      case 0:
        if (this.deckCards[i]["card"]["type_line"].indexOf("Land") < 0)
          this.statsCosts["0"] += this.deckCards[i]["count"]
        break;
      case 1:
        this.statsCosts["1"] += this.deckCards[i]["count"]
        break;
      case 2:
        this.statsCosts["2"] += this.deckCards[i]["count"]
        break;
      case 3:
        this.statsCosts["3"] += this.deckCards[i]["count"]
        break;
      case 4:
        this.statsCosts["4"] += this.deckCards[i]["count"]
        break;
      case 5:
        this.statsCosts["5"] += this.deckCards[i]["count"]
        break;
      default:
        this.statsCosts["6+"] += this.deckCards[i]["count"]
        break;
    }
  }

  calcColors(i) {
    for (let j = 0; j < this.deckCards[i]["card"]["color_identity"].length; j++) {
      this.statsColors[this.deckCards[i]["card"]["color_identity"][j]] += this.deckCards[i]["count"]      
    }
  }

  calcAllStats() {
    // console.log("calcAllStats")
    this.resetAllStats()

    for (let i = 0; i < this.deckCards.length; i++) {
      this.calcTypes(i)
      this.calcRarities(i)
      this.calcCosts(i)
      this.calcColors(i)
    }
    // console.log(this.statsColors);
    this.statsCalculated = true

  }

  resetAllStats(){
    this.statsColors = {
      "B": 0,
      "U": 0,
      "G": 0,
      "R": 0,
      "W": 0,
      "C": 0
    }
  
    this.statsCosts = {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6+": 0
  
    }
  
    this.statsTypes = {
      "creature": 0,
      "artifact": 0,
      "sorcery": 0,
      "planeswalker": 0,
      "instant": 0,
      "enchantment": 0,
      "land": 0
    }
  
    this.statsRarities = {
      "common": 0,
      "uncommon": 0,
      "rare": 0,
      "mythic": 0
    }
  
    this.statsSets = {
      "xln": 0,
      "rix": 0,
      "dom": 0,
      "m19": 0,
      "grn": 0,
      "rna": 0,
      "war": 0,
      "m20": 0
    }
  }

  getPublicDecks(){
    this._api.get("http://localhost:3000/public-decks/").subscribe((response)=> {
      this.publicDecks = [...response["data"]]
      this._api.stopLoading()
    })
    
  }

  getFavourites(){
    this._api.get("http://localhost:3000/favourites/").subscribe((response)=> {
      this.filteredCards = [...response["favourites"]];
      this._api.stopLoading()
    })
  }
}
