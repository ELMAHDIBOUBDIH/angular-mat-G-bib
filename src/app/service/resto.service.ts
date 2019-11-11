import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestoService {
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
  }

  getResto() {
    return this.http.get(`http://localhost:3000/api/resto`);
  }
  StoreResto(resto: any): Observable<any> {
    const Url = `http://localhost:3000/api/resto/store`;
    return this.http.post<any>(Url, {resto}, this.httpOptions);
  }
}
