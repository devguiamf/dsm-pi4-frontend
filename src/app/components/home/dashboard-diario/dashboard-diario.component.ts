import { formatDate } from '@angular/common';

import {
  AfterContentInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import Chart from 'chart.js/auto';
import { DashboardDiario } from './dashboard-diario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-diario.component.html',
  styleUrls: ['./dashboard-diario.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class DashboardDiarioComponent implements OnInit {

  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR';
  @ViewChild('canva', { static: true }) element!: ElementRef;
  chartJS!: Chart;
  date = new Date();
  idProduct!: number

  types = {
    energy: { description: 'Energia - KW', value: '1', icon: 'electric_bolt', type: 'Khw' },
    money: { description: `Dinheiro - R$`, value: '2', icon: 'payments', type: 'R$' }
  }

  
  get typesArray() {
    return Object.values(this.types)
  }

  get ProductId(): number {
    return this.idProduct
  }

  get formattedSelectedData() {
    return  formatDate(this.date, 'yyyy/MM/dd', 'en')
  }

  typeConsumption: string = this.types.money.description;

  constructor(
    private _adapter: DateAdapter<any>,
    private dashService: DashboardDiario
  ) { }
  ngAfterContentInit(): void {
    // this.initChart();
  }

  ngOnInit(): void {
    this._adapter.setLocale(this._locale);
   
    this.getConsumptionsDayli(this.formattedSelectedData)
  }

  private getConsumptionsDayli(date: string) {
    console.log(date);
    return
    
    this.dashService.getConsumptionDay(date, this.ProductId).subscribe(

    )
  }

  initChart() {
    this.chartJS = new Chart(this.element.nativeElement, {
      type: 'line',
      data: {
        labels: Array.from({ length: 24 }, (i: number) => {
          const hour = i + 1
          const isTwoDigits = hour.toString().length > 1
          const formattedHour = isTwoDigits ? `${hour}:00` : `0${hour}:00`
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

  dateSelect(event: MatDatepickerInputEvent<Date>) {
    const dateFormat = this._adapter.format(event.value, 'es');
    console.log(dateFormat);
    
    // this.dashService.getConsumptionDay(dateFormat);
  }

  typeSelect(event: string) {
    console.log(event);
    // this.chartJS.data.datasets[0].label = event;
    this.typeConsumption = event
    
    if (this.chartJS.data.datasets[0].label == 'Dinheiro - R$') {
      this.typeConsumption = this.types.energy.description
    } else {
      this.typeConsumption = this.types.money.description
    }
    // this.chartJS.update();
  }

  addData(newData: any[]) {
    // this.chartJS.update();
  }
}
