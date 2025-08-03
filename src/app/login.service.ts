import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url='http://localhost:8080/login/validate';
  constructor(private http: HttpClient) { }
  getLogin(name: string):Observable<string>{
    const params = new HttpParams().set('name',name);
    return this.http.get('http://localhost:8080/login/name',{params,responseType: 'text'});
  }
  validate(credentials:{username:string; password: string}):Observable<string>{
    return this.http.post(this.url,credentials,{ responseType: 'text'});
  }
}
