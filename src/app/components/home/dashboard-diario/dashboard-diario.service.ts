import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DashboardDiario {
  constructor(
    private http: HttpClient,
  ) { }

  getConsumptionDay(date: string){    
    console.log(date);
  }
}
