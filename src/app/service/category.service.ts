import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  HOST = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  StoreCategory(category: any): Observable<any> {
    const Url = `${this.HOST}/api/category/store`;
    return this.http.post<any>(Url, {category}, this.httpOptions);
  }

  getCategorys() {
    return this.http.get(`http://localhost:3000/api/Categorys`);
  }

  deleteCategory(id) {
    return this.http.delete(`http://localhost:3000/api/category/delete/${id}`, this.httpOptions);
  }

  UpdateCategory(category, id): Observable<any> {
    const Url = `${this.HOST}/api/category/update/${id}`;
    return this.http.put<any>(Url, {category}, this.httpOptions);
  }
}
