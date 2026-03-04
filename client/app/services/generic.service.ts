import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  constructor(protected http: HttpClient, @Inject(String) private baseUrl: string) { }
  // getAll(): Observable<T[]> {
  //   return this.http.get<T[]>(this.baseUrl);
  // }
  // getById(id: number): Observable<T> {
  //   return this.http.get<T>(`${this.baseUrl}/${id}`);
  // }
  // create(entity: T): Observable<T> {
  //   return this.http.post<T>(this.baseUrl, entity);
  // }
  // update(id: string, entity: T): Observable<T> {
  //   return this.http.put<T>(`${this.baseUrl}/${id}`, entity);
  // }
  // delete(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.baseUrl}/${id}`);
  // }
}


