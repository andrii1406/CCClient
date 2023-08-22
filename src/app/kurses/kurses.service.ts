import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "../services/error/error.service";
import {catchError, Observable, tap} from "rxjs";
import {KursesModel} from "./kurses.model";
import {CurrencyService} from "../currencies/currency.service";
import {CurrenciesModel} from "../currencies/currencies.model";
import {ObmenService} from "../services/obmen.service";

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
    private es: ErrorService<any>,
    private obService: ObmenService,
    private curService: CurrencyService,
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
    this.kurses3Local.splice(0)
    this.kurses0Local.splice(0)
    this.kurses1Local.splice(0)
    this.kurses2Local.splice(0)
  }

  kursesToLocals (rbA: KursesModel[]): void {
    rbA.forEach((rbAValue) => {
      let ind = this.getIndexInVlLocalById(rbAValue.vl.id)

      if (ind < 0) {
        const pp = rbAValue.pp
        const vl = rbAValue.vl
        const dt = rbAValue.dt
        rbAValue.pp = this.obService.getKrsObLocalById(pp)
        rbAValue.vl = this.curService.getPpVlLocalById(vl)
        rbAValue.dt = new Date(dt)

        const krs_ob = this.obService.krs_ob
        this.kurses3Local.push(vl)
        this.kurses0Local.push(new KursesModel(null, 0, 0, krs_ob[0], vl, 0, dt, false))
        this.kurses1Local.push(new KursesModel(null, 0, 0, krs_ob[1], vl, 0, dt, false))
        this.kurses2Local.push(new KursesModel(null, 0, 0, krs_ob[2], vl, 0, dt, false))

        ind = this.kurses3Local.length - 1
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
