import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviremonet } from 'src/enviremonents/enviromenents';
import { Consumption, ConsumptionSokect } from 'src/shared/interfaces/consumptions.-interface';
import { Product } from 'src/shared/interfaces/product-interface';
import { StorageService } from 'src/util/storage.service';
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private socket!: Socket;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,

  ) {

  }

  get productsIdInStore(): Product[] {
    const products = JSON.parse(this.storageService.get('products') || '')
    return products[0].id
  }

  public getConsumptionDay(date: string, idProduct: number): Observable<Consumption> {
    return this.http.get<Consumption>(`${enviremonet.API_URL}/products/${idProduct}/consumptions?type=hourly&date=${date}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
  }

  public getConsumptionMonth(date: string, idProduct: number): Observable<Consumption> {
    return this.http.get<Consumption>(`${enviremonet.API_URL}/products/${idProduct}/consumptions?type=daily&date=${date}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
  }

  public getProducts(): Observable<Product> {
    return this.http.get<Product>(`${enviremonet.API_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
  }

  get token() {
    return this.storageService.get('token')
  }

  public conect(): void {
    const payload = {productId: this.productsIdInStore}

    this.socket = io(`${enviremonet.API_URL}/products`)
    this.socket.on('connect', () => {
      this.socket.emit('products:subscribe-consumptions', payload);
    })

    this.socket.on('connect_error', (error) => {
      console.error(error)
    })
  }

  public getConsumptions(): Observable<ConsumptionSokect> {
    return new Observable<any>((observer) => {
      this.socket.on('products:new-consumption', (consumption: any) => {
        observer.next(consumption)
      });
    });
  }

  public desconect():void{
    console.log('disconect');
    this.socket.disconnect()
  }
}
