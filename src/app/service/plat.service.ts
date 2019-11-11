import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlatService {
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  constructor(private http: HttpClient) {
  }
  getplat(id) {
    return this.http.get(`http://localhost:3000/api/plats/${id}`);
  }
  StorePlat(plat: any): Observable<any> {
    const Url = `http://localhost:3000/api/plat/store`;
    return this.http.post<any>(Url, {plat}, this.httpOptions);
  }
}
