import { Component, Inject, OnInit } from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-dashboard-tempo-real',
  templateUrl: './dashboard-tempo-real.component.html',
  styleUrls: ['./dashboard-tempo-real.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
})
export class DashboardTempoRealComponent implements OnInit {

  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR'
  types = [
    {description: 'Energia', value:'1', icon:'electric_bolt', type: 'Khw' },
    {description: `Dinheiro`, value:'2', icon:'payments', type: 'R$'}
  ]

  date = new Date()

  constructor(
    private _adapter: DateAdapter<any>
  ){}


  ngOnInit(): void {
    this._adapter.setLocale(this._locale);
  }

  typeSelect(event: any){

  }
}
