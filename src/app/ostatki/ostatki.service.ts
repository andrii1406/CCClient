import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "../services/error/error.service";
import {catchError, Observable, tap} from "rxjs";
import {OstatkiModel} from "./ostatki.model";

@Injectable({
  providedIn: 'root'
})
export class OstatkiService {

  private _ostatkiLocal: OstatkiModel[] = []
  private url = 'http://localhost:8080/api/v1/ostatki'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) { }

  get ostatkiLocal(): OstatkiModel[] {
    return this._ostatkiLocal;
  }

  set ostatkiLocal(value: OstatkiModel[]) {
    this._ostatkiLocal = value;
  }

  create(newValue: OstatkiModel): Observable<HttpResponse<OstatkiModel>> {
    return this.http.post<OstatkiModel>(this.url, newValue, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) this._ostatkiLocal.push(rb)
        }
      }),
      catchError(this.es.handleError<any>('createOstatki'))
    )
  }

  update(updValue: OstatkiModel): Observable<HttpResponse<OstatkiModel>> {
    return this.http.put<OstatkiModel>(`${this.url}/${updValue.id}`, updValue, {
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('updateOstatki'))
    )
  }

  delete(id: number | undefined | null): Observable<HttpResponse<OstatkiModel>> {
    return this.http.delete<OstatkiModel>(`${this.url}/${id}`,{
      observe: "response"
    }).pipe(
      tap((httpResponse) => {}),
      catchError(this.es.handleError<any>('deleteOstatki'))
    )
  }

  readByNpAndDt(np: number, dtB: Date, dtE: Date): Observable<HttpResponse<OstatkiModel[]>> {
    return this.http.post<OstatkiModel[]>(`${this.url}/${np}`, {dtB, dtE}, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
          }
        }
      }),
      catchError(this.es.handleError<any>('readByNpAndDt_Ostatki'))
    )
  }

}
