import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmprunteService {
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
  }

  getEmprunte(id: any) {
    return this.http.get(`http://localhost:3000/api/Emprunte/` + id);
  }

  getEmpruntes() {
    return this.http.get(`http://localhost:3000/api/empruntes`);
  }

  StoreEmprunte(emprunte: any): Observable<any> {
    console.log('asa', emprunte);
    const Url = `http://localhost:3000/api/Emprunte/store`;
    return this.http.post<any>(Url, {emprunte}, this.httpOptions);
  }

  UpdateEmprunte(emprunte: any, id: number): Observable<any> {
    console.log(emprunte, id);
    const Url = `http://localhost:3000/api/emprunte/update/${id}`;
    return this.http.post<any>(Url, {emprunte}, this.httpOptions);
  }

  deleteEmprunte(id) {
    return this.http.delete(`http://localhost:3000/api/emprunte/delete/${id}`, this.httpOptions);
  }
}
