import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';

import { Chart } from 'chart.js';
import * as moment from "moment";

@Component({
  selector: 'chart',
  templateUrl: 'chart.html',
  styleUrls: ['chart.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() aggsData: any;
  chart: any;

  ngOnInit () {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.aggsData.currentValue.length > 0) {
      this.updateChart(changes.aggsData.currentValue);
    }
  }

  initializeChart () {
    // get document element
    const canvas: HTMLCanvasElement = document.querySelector('#published-messages');
    // Realize chart
    this.chart = new Chart(canvas.getContext('2d'), {
      // The type of chart
      type: 'line',

      // Data for displaying chart
      data: {
        labels: [],
        datasets: [
          {
            backgroundColor: '#cee3fc',
            borderColor: '#5b8ec6',
            borderWidth: 2,
            data: [],
            pointRadius: 0,
            pointHoverRadius: 2
          },
        ],
      },

      // Configuration options
      options: {
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: false
        },
        elements: {
          line: {
            tension: 0, // disables bezier curves
          }
        },
        animation: {
          duration: 0, // general animation time
        },
        hover: {
          animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
      }
    });
  }

  updateChart (aggregatedData: Array<object>) {
    aggregatedData.forEach(dataset => {
      const date = moment(dataset.key).format('HH:mm');

      this.chart.data.labels.push(date);
      this.chart.data.datasets[0].data.push(dataset.doc_count);
    });

    this.chart.update();

  }
}
