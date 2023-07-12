import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {AuthService} from "../jwt/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ErrorService<T> {

  constructor(private authService: AuthService) { }

  public handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.authService.logout()
      this.authService.errorMessage$.next(`ОШИБКА! Операция: ${operation}. error.message: ${error.message}`)

      //Позволяет приложению работать возвращая пустой результат
      return of(result as T)
    }
  }

}
