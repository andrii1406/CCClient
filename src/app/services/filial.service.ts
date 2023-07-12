import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "./error/error.service";
import {catchError, Observable, tap} from "rxjs";
import {filialsLocal} from "../localdata/filials";
import {filial} from "../model/filial";
import {kfLocal} from "../localdata/kflocal";
import {kstat_filial} from "../model/kstat_filial";

@Injectable({
  providedIn: 'root'
})
export class FilialService {

  private url = 'http://localhost:8080/api/v1/filial'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) { }

  readAll(): Observable<HttpResponse<filial[]>> {
    return this.http.get<filial[]>(this.url, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            filialsLocal.splice(0)
            rb.forEach((value) => {
              filialsLocal.push(value)
              kfLocal.push(new kstat_filial(-value.id, String(value.id), value.id))
            })
          }
        }
      }),
      catchError(this.es.handleError<any>('readAllFilial'))
    )
  }

}
