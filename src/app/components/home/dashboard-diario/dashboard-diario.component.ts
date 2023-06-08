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
import Chart from 'chart.js/auto';
import { Consumption, Types } from 'src/shared/interfaces/consumptions.-interface';
import { StorageService } from 'src/util/storage.service';
import { PaginaInicialComponent } from '../pagina-inicial/pagina-inicial.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-diario.component.html',
  styleUrls: ['./dashboard-diario.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class DashboardDiarioComponent implements OnInit {

  @ViewChild('canva', { static: true }) element!: ElementRef;
  chartJS!: Chart;
  consumptions!: Consumption;
  avearag!: number;
  max!: number;
  stateButtonUpdate: boolean = false
  stateValuesConsumptions: boolean = true
  type!: string


  typeConsumption!: string
  constructor(
    private storageService: StorageService,
    private initialPage: PaginaInicialComponent
  ) {}

  ngOnInit(): void {
    this.initialPage.consumptionsHourly.subscribe({
      next: (value: any) => {
        this.stateValuesConsumptions = false;
        this.avearag = value.average;
        this.max = value.max;
        this.addDataInChart(value.data);
      }
    })

    this.initialPage.type.subscribe({
      next: (value: Types) => {
        this.stateValuesConsumptions = false;
        this.typeConsumption = value.description;
        this.type = value.type;
        this.chartJS.data.datasets[0].label = this.typeConsumption
        this.chartJS.update()
      }
    })

    this.initialPage.stateLoading.subscribe({
      next: (value: boolean) => {
        this.stateValuesConsumptions = value
      }
    })
  }

  ngAfterContentInit(): void {
    this.initChart();
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
            backgroundColor: '#fff',
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
    console.log(newData, 'CHART');

    this.chartJS.data.datasets[0].data = newData
    this.chartJS.update()
    return
  }

  ngOnDestroy(): void {

  }

}
