import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "../services/error/error.service";
import {catchError, Observable, tap} from "rxjs";
import {OstatkiModel} from "./ostatki.model";
import {CurrenciesService} from "../currencies/currencies.service";

@Injectable({
  providedIn: 'root'
})
export class OstatkiService {

  private _ostatkiLocal: OstatkiModel[] = []
  private url = 'http://localhost:8080/api/v1/ostatki'

  constructor(
    private http: HttpClient,
    private curService: CurrenciesService,
    private es: ErrorService<any>
  ) { }

  get ostatkiLocal(): OstatkiModel[] {
    return this._ostatkiLocal;
  }

  private getIndexInArrayById(id: number | null): number {
    let ind = -1

    this._ostatkiLocal.forEach((value, index) => {
      if (value.id === id) ind = index
    })

    return ind
  }

  create(newValue: OstatkiModel): Observable<HttpResponse<OstatkiModel>> {
    return this.http.post<OstatkiModel>(this.url, newValue, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            rb.vl = this.curService.getPrVlLocalById(rb.vl)
            rb.dt = new Date(rb.dt)
            this._ostatkiLocal.push(rb)
          }
        }
      }),
      catchError(this.es.handleError<any>('createOstatki'))
    )
  }

  update(updValue: OstatkiModel): Observable<HttpResponse<OstatkiModel>> {
    return this.http.put<OstatkiModel>(`${this.url}/${updValue.id}`, updValue, {
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            let ind = this.getIndexInArrayById(rb.id)

            if (ind >= 0) {
              rb.vl = this.curService.getPrVlLocalById(rb.vl)
              rb.dt = new Date(rb.dt)
              this.ostatkiLocal[ind] = rb
            }
          }
        }
      }),
      catchError(this.es.handleError<any>('updateOstatki'))
    )
  }

  delete(id: number | undefined | null): Observable<HttpResponse<OstatkiModel>> {
    return this.http.delete<OstatkiModel>(`${this.url}/${id}`,{
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            let ind = this.getIndexInArrayById(rb.id)
            if (ind >= 0) this._ostatkiLocal.splice(ind, 1)
          }
        }
      }),
      catchError(this.es.handleError<any>('deleteOstatki'))
    )
  }

  readByNpAndDt(np: number, dtB: Date, dtE: Date): Observable<HttpResponse<OstatkiModel[]>> {
    return this.http.post<OstatkiModel[]>(`${this.url}/${np}`, {dtB, dtE}, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            rb.forEach((value) => {
              value.vl = this.curService.getPrVlLocalById(value.vl)
              value.dt = new Date(value.dt)
            })
            this._ostatkiLocal = rb
          }
        }
      }),
      catchError(this.es.handleError<any>('readByNpAndDt_Ostatki'))
    )
  }

}
