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
export class DashboardDiarioComponent implements OnInit, AfterContentInit {

  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR';
  @ViewChild('canva', { static: true }) element!: ElementRef;
  chartJS!: Chart;
  date = new Date();
  datetime = formatDate(new Date(), 'dd/MM/yyyy', 'en');

  types = [
    { description: 'Energia - KW', value: '1', icon: 'electric_bolt', type: 'Khw' },
    { description: `Dinheiro - R$`, value: '2', icon: 'payments', type: 'R$' },
  ];
  labelHours = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00', '07:00','08:00', '09:00',
    '10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00',
    '22:00','23:00','24:00'];

  typeConsumption: string = this.types[1].description;

  constructor(
    private _adapter: DateAdapter<any>,
    private dashService: DashboardDiario
    ) {}
  ngAfterContentInit(): void {
    // this.initChart();
  }

  ngOnInit(): void {
    this._adapter.setLocale(this._locale);
    this.dashService.getConsumptionDay(this._adapter.format(this.date, 'dd/MM/aaaa'))
  }

  // initChart() {
  //   this.chartJS = new Chart(this.element.nativeElement, {
  //     type: 'line',
  //     data: {
  //       labels: this.labelHours,
  //       datasets: [
  //         {
  //           label: `${this.typeConsumption}`,
  //           data: this.arrayGasto,
  //           borderWidth: 4,
  //           borderColor: 'rgb(58, 148, 74)',
  //           backgroundColor: 'white',
  //           borderCapStyle: 'round',
  //           fill: false,
  //         },
  //       ],
  //     },
  //     options: {
  //       animation: {
  //         duration: 500,
  //         easing: 'linear',
  //         loop: false,
  //       },
  //       layout: {
  //         padding: {
  //           left: 20,
  //           bottom: 20,
  //           right: 20,
  //           top: 20,
  //         },
  //       },
  //     },
  //   });
  // }

  dateSelect(event: MatDatepickerInputEvent<Date>) {
    const dateFormat = this._adapter.format(event.value, 'dd/MM/aaaa');    
    this.dashService.getConsumptionDay(dateFormat);
  }

  typeSelect(event: any) {
    this.chartJS.data.datasets[0].label = event;
    
    if (this.chartJS.data.datasets[0].label == 'Dinheiro - R$') {
      this.typeConsumption = event
    } else {
      this.typeConsumption = event
    }
    this.chartJS.update();
  }

  addData(newData: any[]) {
    // this.chartJS.update();
  }
}
