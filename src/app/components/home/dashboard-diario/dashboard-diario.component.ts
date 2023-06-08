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
import { Consumption } from 'src/shared/interfaces/consumptions.-interface';
import { StorageService } from 'src/util/storage.service';
import { UtilService } from 'src/util/util.service';
import { Product } from 'src/shared/interfaces/product-interface';
import { catchError, of, throwError } from 'rxjs';
import { DashboardService } from '../home.service';

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
  idProduct!: number;
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

  constructor(
    private _adapter: DateAdapter<any>,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this._adapter.setLocale('pt-BR');
  }

  ngAfterContentInit(): void {
    this.initChart();
  }

  get typesArray() {
    return Object.values(this.types)
  }

  get consumptionsStorage() {
    return JSON.parse(this.storageService.get('dayliConsumprtions') || '{}')
  }


  private initChart() {
    this.chartJS = new Chart(this.element.nativeElement, {
      type: 'line',
      data: {
        labels: Array.from({ length: 24 }, (_, i: number) => {
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

  private addDataInChart(newData: any[]) {
    this.chartJS.data.datasets[0].data = newData
    this.chartJS.update()
    return
  }
}
