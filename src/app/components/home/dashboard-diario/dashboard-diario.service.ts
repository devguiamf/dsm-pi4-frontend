import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviremonet } from 'src/enviremonents/enviromenents';
import { Consumption } from 'src/shared/interfaces/consumptions.-interface';
import { StorageService } from 'src/util/storage.service';


@Injectable({
  providedIn: 'root'
})
export class DashboardDiario {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  getConsumptionDay(date: string, idProduct: number): Observable<Consumption>{
    const token = this.storageService.get('token')

    return this.http.get<Consumption>(`${enviremonet.API_URL}/products/1/consumptions?type=hourly&date=${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}
