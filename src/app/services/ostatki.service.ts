import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "./error/error.service";
import {ostatki} from "../model/ostatki";
import {catchError, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OstatkiService {

  private url = 'http://localhost:8080/api/v1/ostatki'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) { }

  create(newValue: ostatki): Observable<HttpResponse<ostatki>> {
    return this.http.post<ostatki>(this.url, newValue, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('createOstatki'))
    )
  }

  update(updValue: ostatki): Observable<HttpResponse<ostatki>> {
    return this.http.put<ostatki>(`${this.url}/${updValue.id}`, updValue, {
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('updateOstatki'))
    )
  }

  delete(id: number | undefined | null): Observable<HttpResponse<ostatki>> {
    return this.http.delete<ostatki>(`${this.url}/${id}`,{
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('deleteOstatki'))
    )
  }

  readByNpAndDt(np: number, dtB: Date, dtE: Date): Observable<HttpResponse<ostatki[]>> {
    return this.http.post<ostatki[]>(`${this.url}/${np}`, {dtB, dtE}, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
          }
        }
      }),
      catchError(this.es.handleError<any>('readByNpAndDt_Ostatki'))
    )
  }

}
