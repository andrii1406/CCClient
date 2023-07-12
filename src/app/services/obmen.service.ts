import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "./error/error.service";
import {catchError, Observable, tap} from "rxjs";
import {pp_obmen} from "../model/pp_obmen";
import {krsObLocal, ppObLocal} from "../localdata/pp_obmen";

@Injectable({
  providedIn: 'root'
})
export class ObmenService {

  private url = 'http://localhost:8080/api/v1/obmen'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) { }

  readAll(): Observable<HttpResponse<pp_obmen[]>> {
    return this.http.get<pp_obmen[]>(this.url, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            ppObLocal.splice(0)
            krsObLocal.splice(0)
            rb.forEach((value) => {
              if(value.id < 2) ppObLocal.push(value)
              krsObLocal.push(value)
            })
          }
        }
      }),
      catchError(this.es.handleError<any>('readAllObmen'))
    )
  }

}
