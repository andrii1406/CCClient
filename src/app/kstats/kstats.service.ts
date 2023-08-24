import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {KstatsModel} from "./kstats.model";
import {ErrorService} from "../services/error/error.service";
import {LoginParamsService} from "../services/login-params/login-params.service";
import {KstatsFilialsModel} from "../kstats_filials/kstats_filials.model";
import {KstatsFilialsService} from "../kstats_filials/kstats_filials.service";

@Injectable({
  providedIn: 'root'
})
export class KstatsService {

  private _kstatsLocal: KstatsModel[] = []
  private url = 'http://localhost:8080/api/v1/kstat'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>,
    private lpService: LoginParamsService,
    public kfService: KstatsFilialsService,
  ) { }

  get kstats(): KstatsModel[] {
    return this._kstatsLocal;
  }

  set kstats(value: KstatsModel[]) {
    this._kstatsLocal = value;
  }

  readAll(): Observable<HttpResponse<KstatsModel[]>> {
    return this.http.get<KstatsModel[]>(this.url, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            this.kfService.kf.splice(0)
            rb.forEach((value) => this.kfService.kf.push(new KstatsFilialsModel(value.id, value.stat, this.lpService.npo)))
          }
        }
      }),
      catchError(this.es.handleError<any>('readAllKstat'))
    )
  }

}
