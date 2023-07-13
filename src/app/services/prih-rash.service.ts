import { Injectable } from '@angular/core';
import {prih_rash} from "../model/prih_rash";
import {prihLocal, rashLocal} from "../localdata/prih_rash";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {ErrorService} from "./error/error.service";

@Injectable({
  providedIn: 'root'
})
export class PrihRashService {

  private url = 'http://localhost:8080/api/v1/prihrash'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) {}

  create(newValue: prih_rash): Observable<HttpResponse<prih_rash>> {
    return this.http.post<prih_rash>(this.url, newValue, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('createPrihRash'))
    )
  }

  update(updValue: prih_rash): Observable<HttpResponse<prih_rash>> {
    return this.http.put<prih_rash>(`${this.url}/${updValue.id}`, updValue, {
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('updatePrihRash'))
    )
  }

  delete(id: number | undefined | null): Observable<HttpResponse<prih_rash>> {
    return this.http.delete<prih_rash>(`${this.url}/${id}`,{
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('deletePrihRash'))
    )
  }

  readByPrAndNpoAndDt(prId: number, npo: number, dtB: Date, dtE: Date): Observable<HttpResponse<prih_rash[]>> {
    return this.http.post<prih_rash[]>(`${this.url}/${prId}/${npo}`, {dtB, dtE},{
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            const prLocal = prId === 0 ? prihLocal : rashLocal
            prLocal.splice(0)
            rb.forEach((value) => {
              value.dt = new Date(value.dt)
              value.dts = new Date(value.dts)
              prLocal.push(value)
            })
          }
        }
      }),
      catchError(this.es.handleError<any>('readByParamsPrihRash'))
    )
  }

}
