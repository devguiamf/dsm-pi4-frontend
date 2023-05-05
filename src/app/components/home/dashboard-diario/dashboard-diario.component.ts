import {formatDate} from '@angular/common';

import { AfterContentInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-diario.component.html',
  styleUrls: ['./dashboard-diario.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
})
export class DashboardDiarioComponent implements OnInit, AfterContentInit {
  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR'
  @ViewChild('canva', { static: true }) element!: ElementRef
  private chart!: Chart
  arrayGasto = [13, 33, 22, 11, 14, 42, 64, 60, 10, 55, 23, 12, 13, 33, 22, 11, 14, 42, 64, 60, 10, 55, 23, 12]
  arrayGasto2 = [1, 5, 4, 5, 5, 3, 1, 3, 8, 7, 8, 12, 11, 10, 15, 7, 5, 8, 9, 5, 5, 5, 1, 5]
  labelHours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
  chartJS!: Chart
  media: string = '119,99'
  date = new Date()
  types = [
    {description: 'Energia', value:'1', icon:'electric_bolt', type: 'Khw' },
    {description: `Dinheiro`, value:'2', icon:'payments', type: 'R$'}
  ]
  datetime = formatDate(new Date(), 'dd/MM/yyyy', 'en')
  typeConsumption: string = this.types[1].description

  constructor(
    private _adapter: DateAdapter<any>,
  ) {

   }
  ngAfterContentInit(): void {
    this.initChart();
  }

  ngOnInit(): void {
    this._adapter.setLocale(this._locale);
    
  }

  

  initChart(){

    this.chartJS = new Chart(this.element.nativeElement, {
      type: 'line',
      data: {
        labels: this.labelHours,
        datasets: [
          {
            label: `${this.typeConsumption}`,
            data: this.arrayGasto,
            borderWidth: 4,
            borderColor: 'rgb(58, 148, 74)',
            backgroundColor: 'white',
            borderCapStyle	: 'round',
            fill: false,
          }
        ]
      },
      options: {
        animation: {
            duration: 500,
            easing: 'linear',
            loop: false
          
        },

  
        layout: {
          padding: {
            left: 20,
            bottom: 20,
            right: 20,
            top: 20,
          }
        }
      }
    })

   

  }

  dateSelect(event: MatDatepickerInputEvent<Date>){
    const dateFormat = this._adapter.format(event.value, 'dd/MM/aaaa')
    this.addData([[1, 2, 5, 7, 2, 16, 20, 26, 34, 28, 21, 15, 9, 3, 1, 1, 3, 4, 4,5, 7, 4, 7, 4]])
 }

  typeSelect(event: any){
    this.chartJS.data.datasets[0].label = event
    if(this.chartJS.data.datasets[0].label == 'Dinheiro'){
      this.media = '119,99'
      this.chartJS.data.datasets[0].borderColor = 'rgb(58, 148, 74)'
      this.chartJS.data.datasets[0].data = this.arrayGasto
      this.typeConsumption = this.types[1].description
    }else{
      this.media = '19,5'
      this.chartJS.data.datasets[0].borderColor = 'rgb(63, 81, 181)'
      this.chartJS.data.datasets[0].data = this.arrayGasto2
      this.typeConsumption = this.types[0].description
    }
    this.chartJS.update();
  }

  addData(newData: any[]){
    this.chartJS.data.datasets[0].data = newData[0]
    this.chartJS.update();
  }

}
