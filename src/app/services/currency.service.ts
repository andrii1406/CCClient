import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {currency} from "../model/currency";
import {ErrorService} from "./error/error.service";
import {ppVlLocal, prVlLocal} from "../localdata/currencies";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private url = 'http://localhost:8080/api/v1/currency'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) { }

  readAll(): Observable<HttpResponse<currency[]>> {
    return this.http.get<currency[]>(this.url, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            prVlLocal.splice(0)
            ppVlLocal.splice(0)
            rb.forEach((value) => {
              prVlLocal.push(value)
              if (value.id !== 4) ppVlLocal.push(value)
            })
          }
        }
      }),
      catchError(this.es.handleError<any>('readAllCurrency'))
    )
  }

}
