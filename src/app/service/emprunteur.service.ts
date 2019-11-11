import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmprunteurService {
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
  }

  getEmprunteur(id: any) {
    return this.http.get(`http://localhost:3000/api/Emprunteur/` + id);
  }

  getEmprunteurs() {
    return this.http.get(`http://localhost:3000/api/Emprunteurs`);
  }

  StoreEmprunteur(emprunteur: any): Observable<any> {
    const Url = `http://localhost:3000/api/Emprunteur/store`;
    return this.http.post<any>(Url, {emprunteur}, this.httpOptions);
  }

  UpdateEmprunteur(emprunteur: any, id: number): Observable<any> {
    const Url = `http://localhost:3000/api/emprunteur/update/${id}`;
    return this.http.post<any>(Url, {emprunteur}, this.httpOptions);
  }

  deleteEmprunteur(id) {
    return this.http.delete(`http://localhost:3000/api/emprunteur/delete/${id}`, this.httpOptions);
  }
}
