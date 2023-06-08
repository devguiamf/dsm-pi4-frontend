import { HttpClient } from '@angular/common/http';
import { Component, Inject, Output } from '@angular/core';
import { StorageService } from 'src/util/storage.service';
import { DashboardService } from '../home.service';
import { Product } from 'src/shared/interfaces/product-interface';
import { Consumption } from 'src/shared/interfaces/consumptions.-interface';
import { catchError, of } from 'rxjs';
import { UtilService } from 'src/util/util.service';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';
import { MAT_DATE_LOCALE, DateAdapter} from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
})
export class PaginaInicialComponent {
  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR';
  consumptionsHourly: Subject<any> = new Subject<any>();
  consumptionsMonth: Subject<any> = new Subject<any>();
  stateLoading: Subject<boolean> = new Subject<boolean>()
  type: Subject<any> = new Subject<any>();
  consumptionsHourlyValues!: Consumption;
  consumptionsMonthValues!: Consumption
  msg!: string;
  period: number = new Date().getHours()
  date!: Date | string;
  datetime!: Date | string;
  idProduct!: number;
  avearag!: number;
  max!: number;
  products!: Product[];
  stateButtonUpdate: boolean = false
  stateValuesConsumptions: boolean = true
  types = {
    energy: { description: 'Energia - KW', value: '1', icon: 'electric_bolt', type: 'kWh' },
    money: { description: `Dinheiro - R$`, value: '2', icon: 'payments', type: 'R$' }
  }
  typeConsumption: string = this.types.money.description;
  tabIndicator!: string | null

  constructor(
    private StorageService: StorageService,
    private homeService: DashboardService,
    private utilService: UtilService,
    private _adapter: DateAdapter<any>,
    private router: Router
  ) {
    this._adapter.setLocale('pt-BR');
    this.date = new Date()
    this.datetime = new Date();

    if((this.StorageService.get('tabActive') || '') != ''){
      this.tabIndicator = this.StorageService.get('tabActive')
    }else{
      this.StorageService.set('tabActive', 'hourly')
      this.tabIndicator = this.StorageService.get('tabActive')
    }

    if ((this.StorageService.get('products') || '').length == 0) {
      this.homeService.getProducts()
        .subscribe((products: Product) => {
          this.StorageService.set('products', JSON.stringify(products))
          this.products = this.productsInStore
          this.idProduct = this.productsInStore[0].id
          if(this.tabIndicator = 'hourly') return this.getConsumptionsHourly(this.formattedSelectedData)
          if(this.tabIndicator = 'month') return this.getConsumptionMonth(this.formattedSelectedData)
        })
    } else {
      this.products = this.productsInStore
      this.idProduct = this.productsInStore[0].id
      if(this.tabIndicator = 'hourly') this.getConsumptionsHourly(this.formattedSelectedData)
      if(this.tabIndicator = 'month') this.getConsumptionMonth(this.formattedSelectedData)
    }
    this.mountMessage()
  }

  get ProductId(): number {
    return this.idProduct
  }

  get productsInStore(): Product[] {
    return JSON.parse(this.StorageService.get('products') || '')
  }

  get userName() {
    return this.StorageService.get('name')
  }

  get formattedSelectedData() {
    return formatDate(this.datetime, 'yyyy-MM-dd', 'en')
  }

  get dateSelectedInStorage() {
    return this.StorageService.get('dayliDateSelected' || '')
  }

  get typesArray() {
    return Object.values(this.types)
  }

  dateSelect(event: any) {
    this.datetime = event.value

  }

  private mountMessage() {
    if (this.period < 5 || this.period > 17) {
      this.msg = 'Boa Noite'
    }
    if (this.period > 5 && this.period < 12) {
      this.msg = 'Bom Dia'
    }
    if (this.period > 12 && this.period < 17) {
      this.msg = 'Boa Tarde'
    }
  }

  private getConsumptionsHourly(date: string) {
    this.stateLoading.next(true)
    this.stateValuesConsumptions = true
    this.homeService.getConsumptionDay(date, this.ProductId)
      .pipe(
        catchError((err: Error) => {
          console.error(err);
          this.utilService.showError(err.message)
          return of();
        })
      )
      .subscribe({
        next: (value: Consumption) => {
          this.stateButtonUpdate = false
          this.consumptionsHourlyValues = value

          if (this.typeConsumption == this.types.energy.description) {
            this.type.next(this.types.energy)
            this.consumptionsHourly.next(value.consumptionsInKw)
            return
          }
          this.type.next(this.types.money)
          this.consumptionsHourly.next(value.consumptionsInMoney)
        }
      })
  }

  private getConsumptionMonth(date: string) {
    this.stateLoading.next(true)
    this.stateValuesConsumptions = true
    this.homeService.getConsumptionMonth(date, this.ProductId)
      .pipe(
        catchError((err: Error) => {
          console.error(err);
          return of();
        })
      )
      .subscribe({
        next: (value: Consumption) => {
          this.stateButtonUpdate = false
          this.consumptionsMonthValues = value
          if (this.typeConsumption == this.types.energy.description) {
            this.type.next(this.types.energy)
            this.consumptionsMonth.next(value.consumptionsInKw)
            return
          }
          this.type.next(this.types.money)
          this.consumptionsMonth.next(value.consumptionsInMoney)
        },

        error: (err: Error) => {
          this.utilService.showError(err.message)
          console.error(err);
        }
      })
  }

  typeSelect(event: string) {
    if(event == this.types.money.description && this.tabIndicator == 'hourly'){
      this.typeConsumption = event
      this.type.next(this.types.money)
      this.consumptionsHourly.next(this.consumptionsHourlyValues.consumptionsInMoney)
      return
    }
    if(event == this.types.energy.description && this.tabIndicator == 'hourly'){
      this.typeConsumption = event
      this.type.next(this.types.energy)
      this.consumptionsHourly.next(this.consumptionsHourlyValues.consumptionsInKw)
      return
    }
    if(event == this.types.money.description && this.tabIndicator == 'month'){
      this.typeConsumption = event
      this.type.next(this.types.money)
      this.consumptionsHourly.next(this.consumptionsHourlyValues.consumptionsInMoney)
      return
    }
    if(event == this.types.energy.description && this.tabIndicator == 'month'){
      this.typeConsumption = event
      this.type.next(this.types.energy)
      this.consumptionsHourly.next(this.consumptionsHourlyValues.consumptionsInMoney)
      return
    }
  }

  onClickUpdateData() {
    this.stateButtonUpdate = true
    if (!this.formattedSelectedData || this.formattedSelectedData.length == 0) return this.utilService.showError('Selecione uma data para buscar')
    this.tabIndicator = this.StorageService.get('tabActive')
    if (this.formattedSelectedData) {
      if(this.tabIndicator == 'hourly'){
        console.log('atualiza');

        this.stateButtonUpdate = true
        this.getConsumptionsHourly(this.formattedSelectedData)
        return
      }
      if(this.tabIndicator == 'month'){
        this.stateButtonUpdate = true
        this.getConsumptionMonth(this.formattedSelectedData)
        return
      }
    }
  }

  onClickHourly() {
    this.StorageService.set('tabActive', 'hourly')
    if (this.consumptionsHourlyValues) {
      if(this.typeConsumption == this.types.energy.description){
        setTimeout(() => {
          this.type.next(this.types.energy)
          this.consumptionsHourly.next(this.consumptionsHourlyValues.consumptionsInKw)
        }, 500);
        return
      }
      setTimeout(() => {
        this.type.next(this.types.money)
        this.consumptionsHourly.next(this.consumptionsHourlyValues.consumptionsInMoney)
      }, 500);
    } else {
      this.getConsumptionsHourly(this.formattedSelectedData)
    }
  }

  onClickMonth() {
    this.StorageService.set('tabActive', 'month')
    if (this.consumptionsMonthValues) {
      if(this.typeConsumption == this.types.energy.description){
        setTimeout(() => {
          this.type.next(this.types.energy)
          this.consumptionsMonth.next(this.consumptionsMonthValues.consumptionsInKw)
        }, 500);
        return
      }
      setTimeout(() => {
        this.type.next(this.types.money)
        this.consumptionsMonth.next(this.consumptionsMonthValues.consumptionsInMoney)
      }, 500);
    } else {
      this.getConsumptionMonth(this.formattedSelectedData)
    }
  }
}
