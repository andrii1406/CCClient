import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ErrorService} from "../services/error/error.service";
import {catchError, Observable, tap} from "rxjs";
import {KstatsFilialsModel} from "../kstats_filials/kstats_filials.model";
import {KstatsFilialsService} from "../kstats_filials/kstats_filials.service";
import {FilialsModel} from "./filials.model";

@Injectable({
  providedIn: 'root'
})
export class FilialsService {

  private _filialsLocal: FilialsModel[] = []
  private url = 'http://localhost:8080/api/v1/filial'

  constructor(
    private http: HttpClient,
    private es: ErrorService<any>,
    private kfService: KstatsFilialsService,
  ) { }

  get filials(): FilialsModel[] {
    return this._filialsLocal;
  }

  set filials(value: FilialsModel[]) {
    this._filialsLocal = value;
  }

  getFilialsLocalById(id: number): FilialsModel | null {
    let res: FilialsModel | null = null

    this.filials.forEach((value) => {
      if (id === value.id) res = value
    })

    return res
  }

  readAll(): Observable<HttpResponse<FilialsModel[]>> {
    return this.http.get<FilialsModel[]>(this.url, {
      params: new HttpParams({}),
      observe: "response"
    }).pipe(
      tap((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            this.filials.splice(0)
            rb.forEach((value) => {
              this.filials.push(value)
              this.kfService.kf.push(new KstatsFilialsModel(-value.id, String(value.id), value.id))
            })
          }
        }
      }),
      catchError(this.es.handleError<any>('readAllFilial'))
    )
  }

}
