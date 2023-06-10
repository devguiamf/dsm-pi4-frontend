import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Chart } from 'chart.js';
import { DashboardService } from '../../pages/home/home.service'
import { ConsumptionSokect } from 'src/shared/interfaces/consumptions.-interface';
import { map } from 'rxjs';
import { PaginaInicialComponent } from '../pagina-inicial/pagina-inicial.component';

@Component({
  selector: 'app-dashboard-tempo-real',
  templateUrl: './dashboard-tempo-real.component.html',
  styleUrls: ['./dashboard-tempo-real.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
})
export class DashboardTempoRealComponent implements OnInit {

  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR'
  @ViewChild('canva', { static: true }) element!: ElementRef;
  chartJS!: Chart;
  energyType!: string
  moneyType!: string
  hours!: string[]
  consumptions!: ConsumptionSokect[]
  cpflQuota: number = 0.9

  types = [
    { description: 'Energia', value: '1', icon: 'electric_bolt', type: 'Khw' },
    { description: `Dinheiro`, value: '2', icon: 'payments', type: 'R$' }
  ]

  date = new Date()

  constructor(
    private _adapter: DateAdapter<any>,
    private dashService: DashboardService,
    private pageInitial: PaginaInicialComponent
  ) {
    this.dashService.conect()
  }

  ngOnInit(): void {
    this._adapter.setLocale(this._locale);

    this.pageInitial.$connetSocket.subscribe({
      next: (connection: boolean) => {
        if (connection) this.conectSocket()
      }
    })

  }

  private conectSocket(){
    let money: number = 0

    this.dashService.getConsumptions()
    .pipe(

      map(consumptions => {
        consumptions.money = consumptions.power * this.cpflQuota
        const date = consumptions.kwmDate.slice(11)


        return consumptions
      })
    )
      .subscribe({
        next: (consumption: ConsumptionSokect) => {
          console.log(consumption);

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
        labels: ['2', '2'],
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
