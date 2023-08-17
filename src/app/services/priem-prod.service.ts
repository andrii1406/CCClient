import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "./error/error.service";
import {priem_prod} from "../model/priem_prod";
import {catchError, Observable, tap} from "rxjs";
import {priemLocal, prodLocal} from "../localdata/priem_prod";
import {CurrencyService} from "./currency.service";

@Injectable({
  providedIn: 'root'
})
export class PriemProdService {

  private url = 'http://localhost:8080/api/v1/priemprod'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>,
    private curService: CurrencyService,
  ) {}

  create(newValue: priem_prod): Observable<HttpResponse<priem_prod>> {
    return this.http.post<priem_prod>(this.url, newValue, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('createPriemProd'))
    )
  }

  readByPpAndNpAndDt(ppId: number, np: number, dtB: Date, dtE: Date): Observable<HttpResponse<priem_prod[]>> {
    return this.http.post<priem_prod[]>(`${this.url}/${ppId}/${np}`, {dtB, dtE}, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            const ppLocal = ppId === 0 ? priemLocal : prodLocal
            ppLocal.splice(0)
            rb.forEach((value) => {
              value.vl = this.curService.getPpVlLocalById(value.vl)
              value.dt = new Date(value.dt)
              value.dts = new Date(value.dts)
              ppLocal.push(value)
            })
          }
        }
      }),
      catchError(this.es.handleError<any>('readByParamsPriemProd'))
    )
  }

  update(updValue: priem_prod): Observable<HttpResponse<priem_prod>> {
    return this.http.put<priem_prod>(`${this.url}/${updValue.id}`, updValue, {
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('updatePriemProd'))
    )
  }

  delete(id: number | undefined | null): Observable<HttpResponse<priem_prod>> {
    return this.http.delete<priem_prod>(`${this.url}/${id}`,{
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('deletePriemProd'))
    )
  }

}
