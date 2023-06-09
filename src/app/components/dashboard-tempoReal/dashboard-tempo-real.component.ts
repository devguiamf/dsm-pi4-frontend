import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import { Chart } from 'chart.js';
import { DashboardService } from '../../pages/home/home.service'

@Component({
  selector: 'app-dashboard-tempo-real',
  templateUrl: './dashboard-tempo-real.component.html',
  styleUrls: ['./dashboard-tempo-real.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
})
export class DashboardTempoRealComponent implements OnInit {

  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR'
  @ViewChild('canva', { static: true }) element!: ElementRef;
  chartJS!: Chart;
  energyType!: string
  moneyType!: string
  hours!: string[]

  types = [
    {description: 'Energia', value:'1', icon:'electric_bolt', type: 'Khw' },
    {description: `Dinheiro`, value:'2', icon:'payments', type: 'R$'}
  ]

  date = new Date()

  constructor(
    private _adapter: DateAdapter<any>,
    private dashService: DashboardService
  ){
    this.dashService.conect()
  }

  ngOnInit(): void {
    this._adapter.setLocale(this._locale);
    this.dashService.getMessages().subscribe({
      next: (consumption: any) => {
        console.log(consumption, 'CONSUMPTION SOCKET');

      }
    })
  }

  ngAfterContentInit(): void {
    this.initChart();
  }

  private initChart() {
    this.chartJS = new Chart(this.element.nativeElement, {
      type: 'line',
      data: {
        labels: ['2','2'],
        datasets: [
          {
            label: 'Dinheiro R$',
            data: [],
            borderWidth: 4,
            borderColor: 'rgb(58, 148, 74)',
            backgroundColor: 'white',
            borderCapStyle: 'round',
            fill: false,
          },
          {
            label: 'Energia kWh',
            data: [],
            borderWidth: 4,
            borderColor: 'yellow',
            backgroundColor: 'white',
            borderCapStyle: 'round',
            fill: false,
          },
        ],
      },
      options: {
        animation: {
          duration: 500,
          easing: 'linear',
          loop: false,
        },
        layout: {
          padding: {
            left: 20,
            bottom: 20,
            right: 20,
            top: 20,
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.dashService.desconect()
  }
}
