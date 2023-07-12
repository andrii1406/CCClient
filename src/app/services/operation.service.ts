import { Injectable } from '@angular/core';
import {pr_op} from "../localdata/pr_operations";
import {pr_operation} from "../model/pr_operation";
import {catchError, Observable, tap} from "rxjs";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "./error/error.service";

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  private url = 'http://localhost:8080/api/v1/operation'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) { }

  readAll(): Observable<HttpResponse<pr_operation[]>> {
    return this.http.get<pr_operation[]>(this.url, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            pr_op.splice(0)
            rb.forEach((value) => pr_op.push(value))
          }
        }
      }),
      catchError(this.es.handleError<any>('readAllOperation'))
    )
  }

}
