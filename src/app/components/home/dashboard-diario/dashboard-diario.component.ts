import { formatDate } from '@angular/common';

import {
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
import { Consumption } from 'src/shared/interfaces/consumptions.-interface';
import { StorageService } from 'src/util/storage.service';
import { UtilService } from 'src/util/util.service';
import { Product } from 'src/shared/interfaces/product-interface';
import { HomeService } from '../home.service';

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
  date!: Date | string;
  datetime!: Date | string;
  idProduct!: number;
  consumptions!: Consumption;
  avearag!: number;
  mode!: number[];
  products!: Product[];
  state: boolean = false

  types = {
    energy: { description: 'Energia - KW', value: '1', icon: 'electric_bolt', type: 'Khw' },
    money: { description: `Dinheiro - R$`, value: '2', icon: 'payments', type: 'R$' }
  }

  typeConsumption: string = this.types.money.description;

  constructor(
    private _adapter: DateAdapter<any>,
    private homeService: HomeService,
    private storageService:  StorageService,
    private utilService: UtilService
  ) {
    this.date = new Date();
    this.datetime = this.date
  }

  ngOnInit(): void {
    this._adapter.setLocale('pt-BR');

    // if(this.dateSelectedInStorage.length > 0){
    //   console.log(this.dateSelectedInStorage);

    //   this.date = this.dateSelectedInStorage
    //   this.datetime = this.date
    // }else{
    //   console.log('else');

    //   this.date = new Date();
    //   this.datetime = this.date
    // }

    this.getConsumptionsDayli(this.formattedSelectedData);

    if(this.consumptionsStorage.length > 0){
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
    return  formatDate(this.datetime, 'yyyy-MM-dd', 'en')
  }

  get consumptionsStorage(){
    return JSON.parse(this.storageService.get('dayliConsumprtions') || '')
  }

  // get dateSelectedInStorage(){
  //   return this.storageService.get('dayliDateSelected' || '')
  // }

  get productsInStorage(){
    return JSON.parse(this.storageService.get('products') || '')
  }

  set productsInStore(products: object) {
    this.storageService.set('products', JSON.stringify(products))
  }

  private getConsumptionsDayli(date: string) {
    console.log(date, 'date');

    this.homeService.getConsumptionDay(date, this.ProductId).subscribe({
      next: (value: Consumption) => {

        this.state = false
        this.storageService.set('dayliConsumprtions', JSON.stringify(value));

        if(this.typeConsumption == this.types.energy.description){
          this.addDataInChart(value.consumptionsInKw.data);
          return
        }
        this.addDataInChart(value.consumptionsInMoney.data);
      },

      error: (err: Error) =>{
        this.utilService.showError(err.message)
        console.log(err);
      }
    })
  }

  onClick(){
    if(!this.formattedSelectedData || this.formattedSelectedData.length == 0) return this.utilService.showError('Selecione uma data para buscar')
    if(this.formattedSelectedData) {
      this.state = true
      this.getConsumptionsDayli(this.formattedSelectedData)
      return
    }
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

  dateSelect(event: any) {
    this.datetime = formatDate(event.value, 'yyyy/MM/dd', 'en')
    this.getConsumptionsDayli(this.formattedSelectedData);
  }

  typeSelect(event: string) {

    this.chartJS.data.datasets[0].label = event;

    if (this.chartJS.data.datasets[0].label == 'Dinheiro - R$') {
      this.addDataInChart(this.consumptions.consumptionsInMoney.data)
      this.avearag = this.consumptions.consumptionsInMoney.average
      this.mode = this.consumptions.consumptionsInMoney.mode
      this.typeConsumption = this.types.money.description;
    } else {
      this.addDataInChart(this.consumptions.consumptionsInKw.data)
      this.avearag = this.consumptions.consumptionsInKw.average
      this.mode = this.consumptions.consumptionsInKw.mode
      this.typeConsumption = this.types.energy.description;
    }

    this.chartJS.update();
  }

  private addDataInChart(newData: any[]) {
    this.chartJS.data.datasets[0].data = newData
    this.chartJS.update()
  }
}
