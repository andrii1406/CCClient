import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "../services/error/error.service";
import {catchError, Observable, tap} from "rxjs";
import {KursesModel} from "./kurses.model";
import {CurrenciesService} from "../currencies/currencies.service";
import {CurrenciesModel} from "../currencies/currencies.model";
import {PpObmensService} from "../pp_obmens/pp_obmens.service";

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
    private obService: PpObmensService,
    private curService: CurrenciesService,
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

  getServiceLocalArrayPointer (ppId: number | undefined): KursesModel[] | null {
    return this.getArrayPointer(ppId, this.kurses0Local, this.kurses1Local, this.kurses2Local)
  }

  getArrayPointer (ppId: number | undefined, arr0: KursesModel[],
                   arr1: KursesModel[], arr2: KursesModel[]): KursesModel[] | null {
    let res = null

    if(ppId === 0) res = arr0
    if(ppId === 1) res = arr1
    if(ppId === 2) res = arr2

    return res
  }

  getIndexInVlLocalById (id: number): number {
    return this.getIndexInVlArrayById(this.kurses3Local, id)
  }

  getIndexInVlArrayById (arr: CurrenciesModel[], id: number): number {
    let ind = -1

    arr.forEach((value, index) => {
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

  kursesModelToServiceLocals (rbA: KursesModel[]) {
    this.kursesModelToArrays(rbA, this.kurses0Local, this.kurses1Local, this.kurses2Local, this.kurses3Local)
  }

  kursesModelToArrays (rbA: KursesModel[], arr0: KursesModel[],  arr1: KursesModel[],
                       arr2: KursesModel[], arr3: CurrenciesModel[]) {
    const krs_ob = this.obService.krs_ob
    rbA.forEach((rbAValue) => {
      let ind = this.getIndexInVlArrayById(arr3, rbAValue.vl.id)

      if (ind < 0) {
        const vl = rbAValue.vl
        const dt = rbAValue.dt

        arr3.push(vl)
        arr0.push(new KursesModel(null, 0, 0, krs_ob[0], vl, 0, dt, false))
        arr1.push(new KursesModel(null, 0, 0, krs_ob[1], vl, 0, dt, false))
        arr2.push(new KursesModel(null, 0, 0, krs_ob[2], vl, 0, dt, false))

        ind = arr3.length - 1
      }
      const ap = this.getArrayPointer(rbAValue.pp.id, arr0, arr1, arr2)
      if (ap) ap[ind] = rbAValue
    })
  }

  linkSubObjectsKursesModelArray(rbA: KursesModel[]) {
    rbA.forEach((rbAValue) => this.linkSubObjectsKursesModelOne(rbAValue))
  }

  linkSubObjectsKursesModelOne(rb: KursesModel) {
    rb.pp = this.obService.getKrsObLocalById(rb.pp)
    rb.vl = this.curService.getPpVlLocalById(rb.vl)
    rb.dt = new Date(rb.dt)
    rb.krs = Number(rb.krs)
  }

  create(newValue: KursesModel[]): Observable<HttpResponse<KursesModel[]>> {
    return this.http.post<KursesModel[]>(this.url, newValue, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) this.kursesModelToServiceLocals(rb)
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
            let ap = this.getServiceLocalArrayPointer(rb.pp.id)

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
            this.linkSubObjectsKursesModelArray(rb)
            this.kursesLocalSplice()
            this.kursesModelToServiceLocals(rb)
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
              value.vl = this.curService.getPpVlLocalById(value.vl)
            })
          }
        }
      }),
      catchError(this.es.handleError<any>('readPrevByNpAndDt_Kurses'))
    )
  }

}
