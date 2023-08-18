import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "../services/error/error.service";
import {catchError, Observable, tap} from "rxjs";
import {KursesModel} from "./kurses.model";
import {getKrsObLocalById} from "../localdata/pp_obmen";
import {CurrencyService} from "../currencies/currency.service";
import {CurrenciesModel} from "../currencies/currencies.model";

@Injectable({
  providedIn: 'root'
})
export class KursesService {

  private _kurses0Local: KursesModel[] = []
  private _kurses1Local: KursesModel[] = []
  private _kurses2Local: KursesModel[] = []
  private _kurses3Local: CurrenciesModel[] = []
  private url = 'http://localhost:8080/api/v1/kurses'

  constructor(
    private http: HttpClient,
    private curService: CurrencyService,
    private es: ErrorService<any>,
  ) {}

  get kurses0Local(): KursesModel[] {
    return this._kurses0Local;
  }

  get kurses1Local(): KursesModel[] {
    return this._kurses1Local;
  }

  get kurses2Local(): KursesModel[] {
    return this._kurses2Local;
  }

  get kurses3Local(): CurrenciesModel[] {
    return this._kurses3Local;
  }

  getArrayPointer (ppId: number | undefined): KursesModel[] | null {
    let res = null

    if(ppId === 0) res = this._kurses0Local
    if(ppId === 1) res = this._kurses1Local
    if(ppId === 2) res = this._kurses2Local

    return res
  }

  getIndexInVlLocalById (id: number): number {
    let ind = -1

    this.kurses3Local.forEach((value, index) => {
      if (id === value.id) ind = index
    })

    return ind
  }

  kursesLocalSplice (): void {
    this._kurses3Local.splice(0)
    this._kurses0Local.splice(0)
    this._kurses1Local.splice(0)
    this._kurses2Local.splice(0)
  }

  kursesToLocals (rbA: KursesModel[]): void {
    rbA.forEach((rbAValue) => {
      let ind = this.getIndexInVlLocalById(rbAValue.vl.id)

      if (ind < 0) {
        rbAValue.vl = this.curService.getPpVlLocalById(rbAValue.vl)
        rbAValue.dt = new Date(rbAValue.dt)

        this._kurses3Local.push(rbAValue.vl)
        this._kurses0Local.push(new KursesModel(null, 0, 0, getKrsObLocalById(0)!, rbAValue.vl, 0, rbAValue.dt, false))
        this._kurses1Local.push(new KursesModel(null, 0, 0, getKrsObLocalById(1)!, rbAValue.vl, 0, rbAValue.dt, false))
        this._kurses2Local.push(new KursesModel(null, 0, 0, getKrsObLocalById(2)!, rbAValue.vl, 0, rbAValue.dt, false))
        ind = this._kurses3Local.length - 1
      }

      const ap = this.getArrayPointer(rbAValue.pp.id)
      if (ap) ap[ind] = rbAValue
    })
  }

  create(newValue: KursesModel[]): Observable<HttpResponse<KursesModel[]>> {
    return this.http.post<KursesModel[]>(this.url, newValue, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) this.kursesToLocals(rb)
        }
      }),
      catchError(this.es.handleError<any>('createAKurses'))
    )
  }

  update(updValue: KursesModel): Observable<HttpResponse<KursesModel>> {
    return this.http.put<KursesModel>(`${this.url}/${updValue.id}`, updValue, {
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            let ap = this.getArrayPointer(rb.pp.id)

            if (ap) {
              let ind = -1

              ap.forEach((value, index) => {
                if (value.id === rb.id) ind = index
              })

              if (ind >= 0) {
                rb.vl = this.curService.getPpVlLocalById(rb.vl)
                rb.dt = new Date(rb.dt)
                ap[ind] = rb
              }
            }
          }
        }
      }),
      catchError(this.es.handleError<any>('updateKurses'))
    )
  }

  readByNpAndDt(np: number, dtB: Date, dtE: Date): Observable<HttpResponse<KursesModel[]>> {
    return this.http.post<KursesModel[]>(`${this.url}/${np}`, {dtB, dtE}, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            this.kursesLocalSplice()
            this.kursesToLocals(rb)
          }
        }
      }),
      catchError(this.es.handleError<any>('readByNpAndDt_Kurses'))
    )
  }

  deleteByNpAndDt(np: number, dtB: Date, dtE: Date): Observable<HttpResponse<KursesModel[]>> {
    return this.http.post<KursesModel[]>(`${this.url}/delbynp/${np}`, {dtB, dtE}, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      catchError(this.es.handleError<any>('deleteByNpAndDt_Kurses'))
    )
  }

  readPrevByNpAndDt(np: number, dtB: Date, dtE: Date, dt: Date): Observable<HttpResponse<KursesModel[]>> {
    return this.http.post<KursesModel[]>(`${this.url}/${np}`, {dtB, dtE}, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            rb.forEach((value) => {
              value.id = null
              value.dt = dt
            })
          }
        }
      }),
      catchError(this.es.handleError<any>('readPrevByNpAndDt_Kurses'))
    )
  }

}
