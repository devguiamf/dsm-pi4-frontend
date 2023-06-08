import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import Chart from 'chart.js/auto';
import { Consumption } from 'src/shared/interfaces/consumptions.-interface';
import { StorageService } from 'src/util/storage.service';

@Component({
  selector: 'app-dashboard-mensal',
  templateUrl: './dashboard-mensal.component.html',
  styleUrls: ['./dashboard-mensal.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
})
export class DashboardMensalComponent implements OnInit {
  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR';
  @ViewChild('canva', { static: true }) element!: ElementRef;
  chartJS!: Chart;
  date!: Date;
  daysOfMonth: number;
  consumptions!: Consumption;
  avearag!: number;
  max!: number;
  stateButtonUpdate: boolean = false
  stateValuesConsumptions: boolean = true
  types = {
    energy: { description: 'Energia - KW', value: '1', icon: 'electric_bolt', type: 'kHw' },
    money: { description: `Dinheiro - R$`, value: '2', icon: 'payments', type: 'R$' }
  }

  typeConsumption: string = this.types.money.description;

  constructor() {
    this.date = new Date()
    this.daysOfMonth = this.getAmountDaysNoMonths(this.date.getFullYear(), this.date.getMonth()+1)
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.initChart();
  }

  private initChart() {
    this.chartJS = new Chart(this.element.nativeElement, {
      type: 'line',
      data: {
        labels: Array.from({ length: this.daysOfMonth }, (_, i: number) => {
          const hour = i + 1
          const isTwoDigits = hour.toString().length > 1
          const formattedHour = isTwoDigits ? `${hour}` : `0${hour}`
          return formattedHour
        }),
        datasets: [
          {
            label: `${this.typeConsumption}`,
            data: [],
            borderWidth: 4,
            borderColor: 'rgb(58, 148, 74)',
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

  private addDataInChart(newData: any[]) {
    this.chartJS.data.datasets[0].data = newData
    this.chartJS.update()
    return
  }

  getAmountDaysNoMonths(ano: number, mes: number) {
    const data = new Date(ano, mes - 1, 1);
    data.setMonth(data.getMonth() + 1);
    data.setDate(data.getDate() - 1);
    return data.getDate();
  }
}
