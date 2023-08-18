import { Injectable } from '@angular/core';
import {pr_op} from "../localdata/pr_operations";
import {catchError, Observable, tap} from "rxjs";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "./error/error.service";
import {PrOperationsModel} from "../pr_operations/pr_operations.model";

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  private url = 'http://localhost:8080/api/v1/operation'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) { }

  readAll(): Observable<HttpResponse<PrOperationsModel[]>> {
    return this.http.get<PrOperationsModel[]>(this.url, {
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
