import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { StorageService } from 'src/util/storage.service';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss']
})
export class PaginaInicialComponent {

  constructor(
    private http: HttpClient,
    private StorageService: StorageService
  ){

    // if(JSON.parse(this.StorageService.get('products') || '') != ''){

    // }else{
    //   this.http.get
    // }
  }
}
