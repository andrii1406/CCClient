import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "./error/error.service";
import {catchError, Observable, tap} from "rxjs";
import {PpObmensModel} from "../pp_obmens/pp_obmens.model";

@Injectable({
  providedIn: 'root'
})
export class ObmenService {

  private _ppObLocal: PpObmensModel[] = []
  private _krsObLocal: PpObmensModel[] = []
  private url = 'http://localhost:8080/api/v1/obmen'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) { }

  get pp_ob(): PpObmensModel[] {
    return this._ppObLocal;
  }

  set pp_ob(value: PpObmensModel[]) {
    this._ppObLocal = value;
  }

  get krs_ob(): PpObmensModel[] {
    return this._krsObLocal;
  }

  set krs_ob(value: PpObmensModel[]) {
    this._krsObLocal = value;
  }

  getKrsObLocalById(krs: PpObmensModel): PpObmensModel {
    return this.getObLocalById(krs, this.krs_ob)
  }

  getPpObLocalById(pp: PpObmensModel): PpObmensModel {
    return this.getObLocalById(pp, this.pp_ob)
  }

  private getObLocalById(ob: PpObmensModel, arr: PpObmensModel[]): PpObmensModel {
    let res = ob

    arr.forEach((value) => {
      if (ob.id === value.id) res = value
    })

    return res
  }

  readAll(): Observable<HttpResponse<PpObmensModel[]>> {
    return this.http.get<PpObmensModel[]>(this.url, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            this.pp_ob.splice(0)
            this.krs_ob.splice(0)
            rb.forEach((value) => {
              if(value.id < 2) this.pp_ob.push(value)
              this.krs_ob.push(value)
            })
          }
        }
      }),
      catchError(this.es.handleError<any>('readAllObmen'))
    )
  }

}
