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
  datetime = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  idProduct!: number

  types = {
    energy: { description: 'Energia - KW', value: '1', icon: 'electric_bolt', type: 'Khw' },
    money: { description: `Dinheiro - R$`, value: '2', icon: 'payments', type: 'R$' }
  }

  get typesArray() {
    return Object.values(this.types)
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

  }

  private getConsumptionsDayli() {

    const idProduct = this.getProductId()
    const date = this.getDateSelected()

    this.dashService.getConsumptionDay(date, idProduct).subscribe(

    )
  }


  getProductId(): number {
    return this.idProduct
  }

  getDateSelected() {
    return this._adapter.format(this.date, 'dd/MM/aaaa')
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
    const dateFormat = this._adapter.format(event.value, 'dd/MM/aaaa');
    // this.dashService.getConsumptionDay(dateFormat);
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
