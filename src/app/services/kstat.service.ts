import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {kstat} from "../model/kstat";
import {ErrorService} from "./error/error.service";
import {kfLocal} from "../localdata/kflocal";
import {kstat_filial} from "../model/kstat_filial";
import {LoginParamsService} from "./login-params/login-params.service";

@Injectable({
  providedIn: 'root'
})
export class KstatService {

  private url = 'http://localhost:8080/api/v1/kstat'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>,
    private lpService: LoginParamsService,
  ) { }

  readAll(): Observable<HttpResponse<kstat[]>> {
    return this.http.get<kstat[]>(this.url, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            kfLocal.splice(0)

            rb.forEach((value) => kfLocal.push(new kstat_filial(value.id, value.stat, this.lpService.npo)))
          }
        }
      }),
      catchError(this.es.handleError<any>('readAllKstat'))
    )
  }

}
