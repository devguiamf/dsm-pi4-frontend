import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviremonet } from 'src/enviremonents/enviromenents';
import { Consumption } from 'src/shared/interfaces/consumptions.-interface';


@Injectable({
  providedIn: 'root'
})
export class DashboardDiario {
  constructor(
    private http: HttpClient,
  ) { }

  getConsumptionDay(date: string, idProduct: number): Observable<Consumption>{    
    return this.http.get<Consumption>(`${enviremonet.API_URL}/products/${idProduct}/consumptions`)
  }
}
