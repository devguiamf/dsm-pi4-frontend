import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { StorageService } from 'src/util/storage.service';
import { DashboardService } from '../home.service';
import { Product } from 'src/shared/interfaces/product-interface';
import { Consumption } from 'src/shared/interfaces/consumptions.-interface';
import { catchError, of } from 'rxjs';
import { UtilService } from 'src/util/util.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss']
})
export class PaginaInicialComponent {
  period: number = new Date().getHours();
  msg!: string;
  date!: Date | string;
  datetime!: Date | string;
  idProduct!: number;
  consumptions!: Consumption;
  avearag!: number;
  max!: number;
  products!: Product[];
  stateButtonUpdate: boolean = false
  stateValuesConsumptions: boolean = true
  types = {
    energy: { description: 'Energia - KW', value: '1', icon: 'electric_bolt', type: 'kHw' },
    money: { description: `Dinheiro - R$`, value: '2', icon: 'payments', type: 'R$' }
  }
  typeConsumption: string = this.types.money.description;

  constructor(
    private http: HttpClient,
    private StorageService: StorageService,
    private homeService: DashboardService,
    private utilService: UtilService
  ){
    this.date = new Date()
     this.datetime = new Date();
    if((this.StorageService.get('products') || '').length == 0){
      this.homeService.getProducts()
      .subscribe((products: Product) => {
          this.StorageService.set('products', JSON.stringify(products))
          this.products = this.productsInStore
          console.log(this.products);

      })
    }else{
      this.products = this.productsInStore
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
    //ativar loading
    this.getConsumptionsDayli(this.formattedSelectedData);
    //emitir evento
  }

  mountMessage(){
    if(this.period < 5 || this.period > 17){
      this.msg = 'Boa Noite'
    }
    if(this.period > 5 && this.period < 12){
      this.msg = 'Bom Dia'
    }
    if(this.period > 12 && this.period < 17){
      this.msg = 'Boa Tarde'
    }
  }

  private getConsumptionsDayli(date: string) {
    this.stateValuesConsumptions = true
    this.homeService.getConsumptionDay(date, this.ProductId)
    .pipe(
      catchError((err: Error) => {
        console.error(err);
        return of();
      })
    )
      .subscribe({
        next: (value: Consumption) => {
          this.consumptions = value
          this.stateButtonUpdate = false
          this.stateValuesConsumptions = false
          this.StorageService.set('dayliConsumprtions', JSON.stringify(value));

          if (this.typeConsumption == this.types.energy.description) {
            //enviar os dados via input
            return
          }
            //enviar os dados via input
        },

        error: (err: Error) => {
          this.utilService.showError(err.message)
          console.error(err);
        }
      })
  }


  typeSelect(event: string) {
    const typeSelected = event;
    //disparar evento
  }

  onClick() {
    this.stateButtonUpdate = true
    // if (!this.formattedSelectedData || this.formattedSelectedData.length == 0) return this.utilService.showError('Selecione uma data para buscar')
    // if (this.formattedSelectedData) {
    //   this.stateButtonUpdate = true
    //   this.getConsumptionsDayli(this.formattedSelectedData)
    //   //emitir evento
    //   return
    // }
  }
}
