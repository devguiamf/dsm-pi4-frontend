import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/util/storage.service';
import { UtilService } from 'src/util/util.service';
import { SettingsService } from './settings.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  constructor(
    private utilService: UtilService,
    private http: HttpClient,
    private storage: StorageService,
    private settingsService: SettingsService
  ){}

  ngOnInit(): void {
    this.searchProducts(this.storage.getId())
  }

  searchProducts(id: string | null): void{
    const header = this.utilService.createheader()
    
    this.settingsService.searchProduct(id, header).pipe(
      catchError(err => {
        if(err.error.error == 'Unauthorized'){
          this.utilService.showError('Sem autorização')
        }
        if(err.status !== 401 && err.status !== 404 ){
          this.utilService.showError('Ops, erro no servidor')
        }
        console.log(err);
        return of([])
      })
    )
    .subscribe(res => {
      console.log(res);
    })
    
  }
}
