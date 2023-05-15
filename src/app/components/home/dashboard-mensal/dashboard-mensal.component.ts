import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard-mensal',
  templateUrl: './dashboard-mensal.component.html',
  styleUrls: ['./dashboard-mensal.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
})
export class DashboardMensalComponent implements OnInit {
  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR'
  @ViewChild('canva', { static: true }) element!: ElementRef;

  types = [
    {description: 'Energia', value:'1', icon:'electric_bolt', type: 'Khw' },
    {description: `Dinheiro`, value:'2', icon:'payments', type: 'R$'}
  ]

  media: string = '119,99';
  typeConsumption: string = this.types[1].description;
  date = new Date()
  chartJS: any;

  constructor(
    private _adapter: DateAdapter<any>,
  ){}
  ngOnInit(): void {
    this.initChart()
  }

  initChart() {
    this.chartJS = new Chart(this.element.nativeElement, {
      type: 'line',
      data: {
        labels: ['01', '02', '03', '04'],  //Aqui deve entrar as labels no horizontal
        datasets: [
          {
            label: `${this.typeConsumption}`,
            data: [1,2,3,4], //aqui deve ir os dados,
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

  dateSelect(event: MatDatepickerInputEvent<Date>) {
    const dateFormat = this._adapter.format(event.value, 'dd/MM/aaaa');
    // this.addData();
  }

  typeSelect(event: any) {
    this.chartJS.data.datasets[0].label = event;
    
    if (this.chartJS.data.datasets[0].label == 'Dinheiro-R$') {

    } else {
     
    }
    this.chartJS.update();
  }

  addData(newData: any[]) {
    // this.chartJS.data.datasets[0].data = newData[0];
    // this.chartJS.update();
  }
}
