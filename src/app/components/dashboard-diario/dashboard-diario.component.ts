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
  @ViewChild('canvaAllConsumption', { static: true }) element2!: ElementRef;

  chartJS!: Chart;
  chartJSBar!: any;
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
    this.initChartLines();
    this.initChartBar();
  }

  get consumptionsStorage() {
    return JSON.parse(this.storageService.get('dayliConsumprtions') || '{}')
  }


  private initChartLines() {
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
            borderColor: '#4bb774',
            borderCapStyle: 'round',
            backgroundColor: '#4bb77477',
            fill: true,
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

  private initChartBar() {
    this.chartJSBar = new Chart(this.element2.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Dinheiro R$','Energia kWh'],
        datasets: [
          {
            data: [50,20],
            borderWidth: 4,
            borderColor: ['#4bb774', '#4551B5'],
            backgroundColor: ['#4bb77477', '#4550b562'],
          }
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
        scales: {
          y: {
            beginAtZero: true
          },
        },
        plugins: {
          legend: {
            display: false
          }
        }
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
