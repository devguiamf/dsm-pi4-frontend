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
  date: Date | string = new Date();
  datetime: Date | string = this.date
  idProduct!: number
  consumptions!: Consumption | string | null


  types = {
    energy: { description: 'Energia - KW', value: '1', icon: 'electric_bolt', type: 'Khw' },
    money: { description: `Dinheiro - R$`, value: '2', icon: 'payments', type: 'R$' }
  }

  typeConsumption: string = this.types.money.description;

  constructor(
    private _adapter: DateAdapter<any>,
    private dashService: DashboardDiario,
    private storageService:  StorageService
  ) { }
  
  ngOnInit(): void {
    this._adapter.setLocale('pt-BR');
    this.getConsumptionsDayli(this.formattedSelectedData);
    
    if(this.consumptionsStorage){
      this.consumptions = this.consumptionsStorage
    }else{
      this.getConsumptionsDayli(this.formattedSelectedData)
    }
  }

  ngAfterContentInit(): void {
    this.initChart();
  }

  get typesArray() {
    return Object.values(this.types)
  }

  get ProductId(): number {
    return this.idProduct
  }

  get formattedSelectedData() {
    return  formatDate(this.datetime, 'yyyy/MM/dd', 'en')
  }

  get consumptionsStorage(){
    return this.storageService.getDayliConsumptions()
  }

  private getConsumptionsDayli(date: string) {
    this.dashService.getConsumptionDay(date, this.ProductId).subscribe({
      next: (value: Consumption) => {
        this.storageService.setDayliConsumptions(value);
        
        if(this.typeConsumption == this.types.energy.description){
          this.addData(value.consumptionInKw.data);
          return
        }
        this.addData(value.consumptionInMoney.data);
      },

      error: (err: Error) =>{
  
      }
    })
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

  dateSelect(event: any) {
    this.datetime = formatDate(event.value, 'yyyy/MM/dd', 'en')
    this.getConsumptionsDayli(this.formattedSelectedData);
  }

  typeSelect(event: string) {
    this.chartJS.data.datasets[0].label = event;
    
    if (this.chartJS.data.datasets[0].label == 'Dinheiro - R$') {
      this.typeConsumption = this.types.money.description;
    } else {
      this.typeConsumption = this.types.energy.description;
    }

    this.chartJS.update();
  }

  addData(newData: any[]) {
    // this.chartJS.update();
  }
}
