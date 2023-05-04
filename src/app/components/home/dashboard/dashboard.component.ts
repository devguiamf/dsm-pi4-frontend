import {formatDate} from '@angular/common';

import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
})
export class DashboardComponent implements OnInit {
  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR'
  date = new Date()
  types = [
    {description: 'Energia', value:'1'},
    {description: 'Dinheiro', value:'2'}
  ]
  
  datetime: BehaviorSubject<any> = new BehaviorSubject(formatDate(this.date, 'dd/MM/yyyy', 'en'))
  typeConsumption: BehaviorSubject<any> = new BehaviorSubject(this.types[1].description)

  constructor(
    private _adapter: DateAdapter<any>,
  
  ) {

   }

  ngOnInit(): void {
    this._adapter.setLocale(this._locale);   
  }

  dateSelect(event: MatDatepickerInputEvent<Date>){
    const dateFormat = this._adapter.format(event.value, 'dd/MM/aaaa')
    this.datetime.next(dateFormat)
  }

  typeSelect(event: Event){
    this.typeConsumption.next(event)
  }

}
