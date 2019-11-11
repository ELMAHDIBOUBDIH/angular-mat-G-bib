import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
  }

  getUsers() {
    return this.http.get(`http://localhost:3000/api/users`);
  }

  StoreUser(user: any): Observable<any> {
    const Url = `http://localhost:3000/api/register`;
    return this.http.post<any>(Url, {user}, this.httpOptions);
  }
}
