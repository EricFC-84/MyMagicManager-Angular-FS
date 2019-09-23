import {
  Component,
  OnInit
} from '@angular/core';
import {
  DataService
} from '../services/data.service';
import {
  Chart
} from 'chart.js';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(public _data: DataService) {

  }
  ngOnInit() {

    console.log("interval")


    // console.log("in stats component")
    let interval = setInterval(() => {
      // console.log("interval")

      if (this._data.statsCalculated) {

        this.renderTypesChart();
        this.renderCostsChart();
        this.renderColorsChart()
        this.renderRaritiesChart();



        clearInterval(interval)
        this._data.statsCalculated = false
      }
    }, 100)
  }


/*   ngOnChange () {
    console.log("interval")

    let interval = setInterval(() => {
      // console.log("interval")

      if (this._data.statsCalculated) {

        this.renderTypesChart();
        this.renderCostsChart();
        this.renderColorsChart()
        this.renderRaritiesChart();



        clearInterval(interval)
        this._data.statsCalculated = false
      }
    }, 100)
  } */


/*   ngOnDestroy() {
    console.log("destroy")
    this._data.statsCalculated = false;
    this._data.resetAllStats()
} */

  renderTypesChart() {
    let typesLabels = ['Creature', 'Sorcery', 'Instant', 'Enchantment', 'Artifact', 'Planeswalker', 'Land']
    let typesData = [this._data.statsTypes["creature"], this._data.statsTypes["sorcery"], this._data.statsTypes["instant"], this._data.statsTypes["enchantment"], this._data.statsTypes["artifact"], this._data.statsTypes["planeswalker"], this._data.statsTypes["land"]]
    let typesOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            precision: 0
          }
        }]
      },
      legend: {
        display: false
      }
    }
    let bgColors = [
      'rgba(255, 99, 132)',
      'rgba(54, 162, 235)',
      'rgba(255, 206, 86)',
      'rgba(75, 192, 192)',
      'rgba(153, 102, 255)',
      'rgba(255, 159, 64)',
      'rgba(255, 85, 85)'
    ];
    let borderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(255, 85, 85)'
    ]

    this.renderChart("types-chart", typesLabels, typesData, "bar", typesOptions, bgColors, borderColors)
  }

  renderColorsChart() {

    let colorsLabels = ['Black', 'Blue', 'Green', 'Red', 'White', 'Colorless']
    let colorsData = [this._data.statsColors["B"], this._data.statsColors["U"], this._data.statsColors["G"], this._data.statsColors["R"], this._data.statsColors["W"], this._data.statsColors["C"]]
    let colorsOptions = {
      legend: {
        display: true,
        labels: {
          filter: function (legendItem, data) {
            //  console.log (legendItem)
            return colorsData[legendItem.index] > 0
          }
        }
      }
    }
    let bgColors = [
      '#312f35',
      '#348ab5',
      '#068854',
      '#d83d0e',
      '#ecebe7',
      '#c0ccd5'
    ];
    let borderColors = [
      '#312f35',
      '#348ab5',
      '#068854',
      '#d83d0e',
      '#ecebe7',
      '#c0ccd5'
    ]
    // console.log(colorsData)

    this.renderChart("colors-chart", colorsLabels, colorsData, "pie", colorsOptions, bgColors, borderColors)
  }

  renderCostsChart() {
    let costsLabels = ['0', '1', '2', '3', '4', '5', '6+']
    let costsData = [this._data.statsCosts["0"], this._data.statsCosts["1"], this._data.statsCosts["2"], this._data.statsCosts["3"], this._data.statsCosts["4"], this._data.statsCosts["5"], this._data.statsCosts["6+"]]
    let costsOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            precision: 0
          }
        }]
      },
      legend: {
        display: true,
        labels: {
          filter: function (legendItem, data) {
            //  console.log (legendItem)
            return costsData[legendItem.index] > 0
          }
        }
      }
    }
    let bgColors = [
      'rgba(255, 99, 132)',
      'rgba(54, 162, 235)',
      'rgba(255, 206, 86)',
      'rgba(75, 192, 192)',
      'rgba(153, 102, 255)',
      'rgba(255, 159, 64)',
      'rgba(255, 85, 85)'
    ];
    let borderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(255, 85, 85)'
    ]

    this.renderChart("costs-chart", costsLabels, costsData, "line", costsOptions, bgColors, borderColors)
  }

  renderRaritiesChart() {
    let raritiesLabels = ['Common', 'Uncommon', 'Rare', 'Mythic']
    let raritiesData = [this._data.statsRarities["common"], this._data.statsRarities["uncommon"], this._data.statsRarities["rare"], this._data.statsRarities["mythic"]]
    let raritiesOptions = {
      legend: {
        display: true,
        labels: {
          filter: function (legendItem, data) {
            //  console.log (legendItem)
            return raritiesData[legendItem.index] > 0
          }
        }
      },
      scale: {
        ticks: {
           display: false
        }
     }
    }
    let bgColors = [
      '#343a40',
      '#6c757d',
      '#ffc107',
      '#dc3545'     
    ];
    let borderColors = [
      '#343a40',
      '#6c757d',
      '#ffc107',
      '#dc3545'  
    ]
    // console.log(raritiesData)

    this.renderChart("rarity-chart", raritiesLabels, raritiesData, "polarArea", raritiesOptions, bgColors, borderColors)
  }


  renderChart(chartID, labels, data, chartType, chartOptions, bgColors, borderColors) {
    // console.log("rendering", this._data.statsTypes["creature"]);

    var myChart = new Chart(chartID, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          label: '',
          data: data,
          fill: false,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: chartOptions,
    });
  }

}
