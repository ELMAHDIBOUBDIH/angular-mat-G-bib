import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  HOST = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }

  login(user: any): Observable<any> {
    const Url = `${this.HOST}/api/login`;
    return this.http.post<any>(Url, {user}, this.httpOptions)
      .pipe(
        map((result: any) => {
          localStorage.setItem('access_token', result.token);
          return result;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
  }
}
