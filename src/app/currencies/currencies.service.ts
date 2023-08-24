import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {ErrorService} from "../services/error/error.service";
import {CurrenciesModel} from "./currencies.model";

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  private _prVlLocal: CurrenciesModel[] = []
  private _ppVlLocal: CurrenciesModel[] = []
  private url = 'http://localhost:8080/api/v1/currency'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) { }

  get prVlLocal(): CurrenciesModel[] {
    return this._prVlLocal;
  }

  get ppVlLocal(): CurrenciesModel[] {
    return this._ppVlLocal;
  }

  getPpVlLocalById(vl: CurrenciesModel): CurrenciesModel {
    return this.getVlLocalById(vl, this.ppVlLocal)
  }

  getPrVlLocalById(vl: CurrenciesModel): CurrenciesModel {
    return this.getVlLocalById(vl, this.prVlLocal)
  }

  getVlLocalById(vl: CurrenciesModel, arr: CurrenciesModel[]): CurrenciesModel {
    let res = vl

    arr.forEach((value) => {
      if (vl.id === value.id) res = value
    })

    return res
  }

  readAll(): Observable<HttpResponse<CurrenciesModel[]>> {
    return this.http.get<CurrenciesModel[]>(this.url, {
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
