import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "../services/error/error.service";
import {catchError, Observable, tap} from "rxjs";
import {
  getArrayPointer,
  kursesLocalSplice,
  kursesToLocals
} from "../localdata/kurses";
import {KursesModel} from "./kurses.model";

@Injectable({
  providedIn: 'root'
})
export class KursesService {

  private url = 'http://localhost:8080/api/v1/kurses'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) {}

  create(newValue: KursesModel[]): Observable<HttpResponse<KursesModel[]>> {
    return this.http.post<KursesModel[]>(this.url, newValue, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) kursesToLocals(rb)
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
            let ap = getArrayPointer(rb.pp.id)
              if (ap) {
              let ind = -1

              ap.forEach((value, index) => {
                if (value.id === rb.id) ind = index
              })

              if (ind >= 0) {
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
            kursesLocalSplice()
            kursesToLocals(rb)
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
