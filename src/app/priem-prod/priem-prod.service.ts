import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "../services/error/error.service";
import {PriemProdModel} from "./priem-prod.model";
import {catchError, Observable, tap} from "rxjs";
import {CurrenciesService} from "../currencies/currencies.service";
import {PpObmensService} from "../pp_obmens/pp_obmens.service";

@Injectable({
  providedIn: 'root'
})
export class PriemProdService {

  private _priemLocal: PriemProdModel[] = []
  private _prodLocal: PriemProdModel[] = []
  private url = 'http://localhost:8080/api/v1/priemprod'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>,
    private obService: PpObmensService,
    private curService: CurrenciesService,
  ) {}

  get priem(): PriemProdModel[] {
    return this._priemLocal;
  }

  set priem(value: PriemProdModel[]) {
    this._priemLocal = value;
  }

  get prod(): PriemProdModel[] {
    return this._prodLocal;
  }

  set prod(value: PriemProdModel[]) {
    this._prodLocal = value;
  }

  create(newValue: PriemProdModel): Observable<HttpResponse<PriemProdModel>> {
    return this.http.post<PriemProdModel>(this.url, newValue, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('createPriemProd'))
    )
  }

  readByPpAndNpAndDt(ppId: number, np: number, dtB: Date, dtE: Date): Observable<HttpResponse<PriemProdModel[]>> {
    return this.http.post<PriemProdModel[]>(`${this.url}/${ppId}/${np}`, {dtB, dtE}, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            const pp = ppId === 0 ? this.priem : this.prod
            pp.splice(0)
            rb.forEach((value) => {
              value.pp = this.obService.getPpObLocalById(value.pp)
              value.vl = this.curService.getPpVlLocalById(value.vl)
              value.dt = new Date(value.dt)
              value.dts = new Date(value.dts)
              pp.push(value)
            })
          }
        }
      }),
      catchError(this.es.handleError<any>('readByParamsPriemProd'))
    )
  }

  update(updValue: PriemProdModel): Observable<HttpResponse<PriemProdModel>> {
    return this.http.put<PriemProdModel>(`${this.url}/${updValue.id}`, updValue, {
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('updatePriemProd'))
    )
  }

  delete(id: number | undefined | null): Observable<HttpResponse<PriemProdModel>> {
    return this.http.delete<PriemProdModel>(`${this.url}/${id}`,{
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('deletePriemProd'))
    )
  }

}
