import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {ErrorService} from "../services/error/error.service";
import {PrOperationsService} from "../pr_operations/pr_operations.service";
import {CurrenciesService} from "../currencies/currencies.service";
import {PrihRashModel} from "./prih-rash.model";

@Injectable({
  providedIn: 'root'
})
export class PrihRashService {

  private _prihLocal: PrihRashModel[] = []
  private _rashLocal: PrihRashModel[] = []
  private url = 'http://localhost:8080/api/v1/prihrash'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>,
    private opService: PrOperationsService,
    private curService: CurrenciesService,
  ) {}

  get prih(): PrihRashModel[] {
    return this._prihLocal;
  }

  set prih(value: PrihRashModel[]) {
    this._prihLocal = value;
  }

  get rash(): PrihRashModel[] {
    return this._rashLocal;
  }

  set rash(value: PrihRashModel[]) {
    this._rashLocal = value;
  }

  create(newValue: PrihRashModel): Observable<HttpResponse<PrihRashModel>> {
    return this.http.post<PrihRashModel>(this.url, newValue, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('createPrihRash'))
    )
  }

  update(updValue: PrihRashModel): Observable<HttpResponse<PrihRashModel>> {
    return this.http.put<PrihRashModel>(`${this.url}/${updValue.id}`, updValue, {
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('updatePrihRash'))
    )
  }

  delete(id: number | undefined | null): Observable<HttpResponse<PrihRashModel>> {
    return this.http.delete<PrihRashModel>(`${this.url}/${id}`,{
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('deletePrihRash'))
    )
  }

  readByPrAndNpoAndDt(prId: number, npo: number, dtB: Date, dtE: Date): Observable<HttpResponse<PrihRashModel[]>> {
    return this.http.post<PrihRashModel[]>(`${this.url}/${prId}/${npo}`, {dtB, dtE},{
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            const pr = prId === 0 ? this.prih : this.rash
            pr.splice(0)
            rb.forEach((value) => {
              value.pr = this.opService.getOpLocalById(value.pr)
              value.vl = this.curService.getPrVlLocalById(value.vl)
              value.dt = new Date(value.dt)
              value.dts = new Date(value.dts)
              pr.push(value)
            })
          }
        }
      }),
      catchError(this.es.handleError<any>('readByParamsPrihRash'))
    )
  }

}
