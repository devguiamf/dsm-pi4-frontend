import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(
    private toastrService: ToastrService,
    private storage: StorageService
  ) { }

  showSucess(msg: string){    
    this.toastrService.success(msg)
  }

  showError(msg: string){
    this.toastrService.error(msg)
  }

  // createheader(){
  //   const token: any = this.storage.getToken()


  //   return header
  // }
}
