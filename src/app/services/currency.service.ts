import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {currency} from "../model/currency";
import {ErrorService} from "./error/error.service";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private _prVlLocal: currency[] = []
  private _ppVlLocal: currency[] = []
  private url = 'http://localhost:8080/api/v1/currency'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) { }

  get prVlLocal(): currency[] {
    return this._prVlLocal;
  }

  get ppVlLocal(): currency[] {
    return this._ppVlLocal;
  }

  getPpVlLocalById(vl: currency): currency {
    return this.getVlLocalById(vl, this.ppVlLocal)
  }

  getPrVlLocalById(vl: currency): currency {
    return this.getVlLocalById(vl, this.prVlLocal)
  }

  getVlLocalById(vl: currency, arr: currency[]): currency {
    let res = vl

    arr.forEach((value) => {
      if (vl.id === value.id) res = value
    })

    return res
  }

  readAll(): Observable<HttpResponse<currency[]>> {
    return this.http.get<currency[]>(this.url, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            this.prVlLocal.splice(0)
            this.ppVlLocal.splice(0)
            rb.forEach((value) => {
              this.prVlLocal.push(value)
              if (value.id !== 4) this.ppVlLocal.push(value)
            })
          }
        }
      }),
      catchError(this.es.handleError<any>('readAllCurrency'))
    )
  }

}
