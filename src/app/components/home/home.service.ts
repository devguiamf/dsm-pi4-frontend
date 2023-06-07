import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviremonet } from 'src/enviremonents/enviromenents';
import { Consumption } from 'src/shared/interfaces/consumptions.-interface';
import { StorageService } from 'src/util/storage.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  getConsumptionDay(date: string, idProduct: number): Observable<Consumption>{
    const token = this.storageService.get('token')
    return this.http.get<Consumption>(`${enviremonet.API_URL}/products/${idProduct}/consumptions?type=hourly&date=${date}` ,{
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  }

  getConsumptionMonth(date: string, idProduct: number): Observable<Consumption>{
    const token = this.storageService.get('token')
    return this.http.get<Consumption>(`${enviremonet.API_URL}/products/${idProduct}/consumptions?type=month&date=${date}` ,{
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  }

  getProductUsers(idUser: string | null): Observable<any>{
    const token = this.storageService.get('token')
    return this.http.get(`${enviremonet.API_URL}/products`, {
      headers: {
        'Authorization': 'Bearer '+ token
      }
    })
  }
}
