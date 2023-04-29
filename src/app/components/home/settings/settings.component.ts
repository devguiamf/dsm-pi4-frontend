import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/util/storage.service';
import { UtilService } from 'src/util/util.service';
import { SettingsService } from './settings.service';
import { catchError, of } from 'rxjs';
import { Product } from 'src/shared/interfaces/product-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  products: Product[] = []
  userInfo: any

  constructor(
    private utilService: UtilService,
    private http: HttpClient,
    private storage: StorageService,
    private settingsService: SettingsService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.searchProducts(this.storage.getId())
    this.searchUser(this.storage.getId())
  }

  searchProducts(id: string | null): void{
    this.settingsService.searchProduct(id)
      .subscribe(res => {
        this.products = res
        console.log(this.products);
        
      })
  }

  searchUser(id: string | null){
    this.settingsService.searchInfosUser(id)
      .subscribe(res => {
        this.userInfo = res
        console.log(res);
        
      })
  }

  goToEditUser(){
    this.router.navigateByUrl("home/edit-user")
  }
}
