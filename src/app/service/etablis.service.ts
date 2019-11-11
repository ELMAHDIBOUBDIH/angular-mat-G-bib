import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtablisService {
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
  }

  getEtablissements() {
    return this.http.get(`http://localhost:3000/api/etablissements`);
  }

  getFilieres(idetablis) {
    return this.http.get(`http://localhost:3000/api/filieres/` + idetablis);
  }

  storeEtablissement(etablissement: any): Observable<any> {
    const Url = `http://localhost:3000/api/etablissement/store`;
    return this.http.post<any>(Url, {etablissement}, this.httpOptions);
  }

  storeFiliere(filiere: any): Observable<any> {
    const Url = `http://localhost:3000/api/filiere/store`;
    return this.http.post<any>(Url, {filiere}, this.httpOptions);
  }
}
