import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LivreService {
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'bearer' + localStorage.getItem('access_token')
    })
  };
  HOST = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getLivres() {
    return this.http.get(`${this.HOST}/api/Livres`, this.httpOptions);
  }

  StoreLivre(livre: any): Observable<any> {
    const Url = `${this.HOST}/api/livre/store`;
    return this.http.post<any>(Url, {livre}, this.httpOptions);
  }

  destroyLivre(id: any) {
    const Url = `${this.HOST}/api/delete/livre/` + id;
    return this.http.delete(Url, this.httpOptions);
  }

  uploadXLS(file: File): Observable<any> {
    console.log(file);
    const fd = new FormData();
    fd.append('file', file);
    console.log(file);
    const Url = `${this.HOST}/api/uploadxls`;
    return this.http.post<any>(Url, file);
  }
}
