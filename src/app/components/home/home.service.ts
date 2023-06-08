import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviremonet } from 'src/enviremonents/enviromenents';
import { Consumption } from 'src/shared/interfaces/consumptions.-interface';
import { Product } from 'src/shared/interfaces/product-interface';
import { StorageService } from 'src/util/storage.service';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  getConsumptionDay(date: string, idProduct: number): Observable<Consumption>{
    return this.http.get<Consumption>(`${enviremonet.API_URL}/products/${idProduct}/consumptions?type=hourly&date=${date}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
  }

  getConsumptionMonth(date: string, idProduct: number): Observable<Consumption>{
    return this.http.get<Consumption>(`${enviremonet.API_URL}/products/${idProduct}/consumptions?type=daily&date=${date}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
  }

  getProducts(): Observable<Product> {
    return this.http.get<Product>(`${enviremonet.API_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
  }

  get token(){
    return this.storageService.get('token')
  }
}
