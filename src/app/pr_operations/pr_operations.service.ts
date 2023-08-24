import { Injectable } from '@angular/core';
import {catchError, Observable, tap} from "rxjs";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "../services/error/error.service";
import {PrOperationsModel} from "./pr_operations.model";

@Injectable({
  providedIn: 'root'
})
export class PrOperationsService {

  private _prOpLocal: PrOperationsModel[] = []
  private url = 'http://localhost:8080/api/v1/operation'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>
  ) { }

  get pr_op(): PrOperationsModel[] {
    return this._prOpLocal;
  }

  set pr_op(value: PrOperationsModel[]) {
    this._prOpLocal = value;
  }

  getOpLocalById(op: PrOperationsModel): PrOperationsModel {
    let res = op

    this.pr_op.forEach((value) => {
      if (op.id === value.id) res = value
    })

    return res
  }

  readAll(): Observable<HttpResponse<PrOperationsModel[]>> {
    return this.http.get<PrOperationsModel[]>(this.url, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) this.pr_op = rb
        }
      }),
      catchError(this.es.handleError<any>('readAllOperation'))
    )
  }

}
