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

declare var $: any

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  querySet: string[] = [];
  queryRarity: string[] = []
  queryType: string[] = []
  isCreature: boolean = false;
  queryColor: string[] = []
  queryCreatureType: string[] = []
  queryCost: string[] = []
  queryFavourites: boolean = false;
  queryName: string = "";
  exclusive: boolean = false

  constructor(public _data: DataService, public _user: UserService) {}

  ngOnInit() {
    this.refreshSelectpickers();


  }
  ngAfterViewInit() {
    $('#set-list').selectpicker("val", [`${this._data.sets.length - 1}: '${this._data.sets[this._data.sets.length - 1]}'`])
    this.querySet.push(this._data.sets[this._data.sets.length - 1])
    // $('.selectpicker').selectpicker('refresh')
  }

  refreshSelectpickers() {
    $('.selectpicker').addClass('m-1').selectpicker('setStyle');
    $('.selectpicker').selectpicker('refresh')


  }

  selectType() {

    /*    // console.log(this.queryType)
       // console.log(this.queryType.indexOf("Creature")) */

    if (this.queryType.indexOf('Creature') >= 0) {
      $('#creature-type').prop('disabled', false);
    } else {
      this.queryCreatureType = [];
      $('#creature-type').selectpicker('deselectAll');

      $('#creature-type').prop('disabled', true);


    }
    $('#creature-type').selectpicker('refresh')
    // console.log(this.isCreature)
  }

  filter() {

    let query = {}
    let arrFilters = [];

    let numFilters = 0;


    if (this.queryName.length > 0) {
      let arrayWords = this.queryName.split(" ")
      numFilters++;
      arrFilters.push({
        $or: this.createQueryOr("name", arrayWords)
      })
    }

    if (this.queryRarity.length > 0) {
      numFilters++
      arrFilters.push({
        $or: this.createQueryOr("rarity", this.queryRarity)
      })
    }


    if (this.queryType.length > 0) {
      numFilters++
      arrFilters.push({
        $or: this.createQueryOr("type_line", this.queryType)
      })
    }


    if (this.queryCreatureType.length > 0) {
      numFilters++
      arrFilters.push({
        $or: this.createQueryOr("type_line", this.queryCreatureType)
      })

    }

    if (this.queryColor.length > 0) {

      numFilters++
      if (this.exclusive) {
        let exclusiveArray = []
        exclusiveArray.push({
          $and: this.createQueryOr("color_identity", this.queryColor)
        })
        for (let i = 0; i < this.queryColor.length; i++) {
          exclusiveArray.push({
            $and: [{
              "color_identity": [this.queryColor[i]]
              },
              {
                "color_identity": {
                  $size: 1
                }
              }
            ]
          })
        }
        arrFilters.push({
          $or: exclusiveArray
        })
      } else {

        arrFilters.push({
          $or: this.createQueryOr("color_identity", this.queryColor)
        })
      }
    }


    if (this.queryCost.length > 0) {
      numFilters++
      arrFilters.push({
        $or: this.createQueryOr("cmc", this.queryCost)
      })
    }


    if (this.querySet.length > 0) {
      numFilters++
      arrFilters.push({
        $or: this.createQueryOr("set", this.querySet)
      })
    } else {

      $('.selectpicker#set-list').selectpicker("val", [`${this._data.sets.length - 1}: '${this._data.sets[this._data.sets.length - 1]}'`])


      arrFilters.push({
        "set": this._data.sets[this._data.sets.length - 1]
      })
    }
    /*  arrFilters.push({
          "set": this.querySet
        }) */


    query["$and"] = arrFilters;
    console.log(query)
    // console.log(query)
    this._data.getFilteredCards(query, this.queryFavourites)
  }

  createQueryOr(attribute: string, query: string[]): object[] {

    let orQuery = []
    for (let i = 0; i < query.length; i++) {
      let element = {}
      if (attribute == "type_line" || attribute == "name") {
        element[attribute] = {
          $regex: `${query[i]}`,
          "$options": "i"
        }
        // console.log(element)
        orQuery.push(element)

      } else if (attribute == "cmc" && query[i] == "6") {

        element[attribute] = {
          "$gt": 5
        }
        orQuery.push(element)

      } else {
        element[attribute] = query[i]
        orQuery.push(element)
      }
    }
    console.log(orQuery)
    return orQuery
  }

  clearFilters() {
    $('.selectpicker').selectpicker('deselectAll');
    this.querySet = [];
    this.queryRarity = []
    this.queryType = []
    this.isCreature = false;
    this.queryColor = []
    this.queryCreatureType = []
    this.queryCost = []
    this.queryFavourites = false;
    this.queryName = "";
    $('.selectpicker#set-list').selectpicker("val", [`${this._data.sets.length - 1}: '${this._data.sets[this._data.sets.length - 1]}'`])
    this.querySet.push(this._data.sets[this._data.sets.length - 1])
  }

}
