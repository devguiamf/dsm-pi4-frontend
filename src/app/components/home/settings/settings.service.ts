import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviremonet } from 'src/enviremonents/enviromenents';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient
  ) { }

  searchProduct(id: string | null, header: any): Observable<any>{        
    return this.http.get<any>(`${enviremonet.API_URL}/product/${id}`, header )
  }
}
