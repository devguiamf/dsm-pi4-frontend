import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { StorageService } from 'src/util/storage.service';
import { HomeService } from '../home.service';
import { Product } from 'src/shared/interfaces/product-interface';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss']
})
export class PaginaInicialComponent {

  constructor(
    private http: HttpClient,
    private StorageService: StorageService,
    private homeService: HomeService
  ){

    if(this.StorageService.get('products')){
      console.log('if');
    }else{
      const idUser = this.StorageService.get('idUser')
      this.homeService.getProductUsers(idUser).subscribe({
        next: (products: Product[]) => {
          this.StorageService.set('products', JSON.stringify(products));
        }
      })
    }
  }
}
