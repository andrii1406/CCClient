import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, forkJoin, mergeMap, Observable, of, tap, throwError} from "rxjs";
import {JwtResponse} from "../../model/jwt/jwt-response";
import {AuthLoginInfo} from "../../model/jwt/login-info";
import {SignUpInfo} from "../../model/jwt/signup-info";
import {Router} from "@angular/router";
import {TokenStorageService} from "./token-storage.service";
import {kurses0Local, kurses1Local, kurses2Local, kurses3Local} from "../../localdata/kurses";
import {OperationService} from "../operation.service";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false
  roles: string[] = []
  errorMessage$ = new BehaviorSubject<string>('')
  isLoggedIn$ = new BehaviorSubject<boolean>(false)

  private loginUrl = 'http://localhost:8080/api/v1/auth/signin'
  private signupUrl = 'http://localhost:8080/api/v1/auth/signup'


  constructor(private router: Router,
              private http: HttpClient,
              private tokenStorage: TokenStorageService,
  ) {}

  attemptAuth(credentials: AuthLoginInfo): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.loginUrl, credentials, httpOptions)
      .pipe(
        tap((jwtResponse) => {
          if (jwtResponse) {
            this.tokenStorage.saveToken(jwtResponse.token)
            this.tokenStorage.saveUsername(jwtResponse.username)
            this.tokenStorage.saveAuthorities(jwtResponse.roles)

            this.roles = this.tokenStorage.getAuthorities()
          }
        }),
        catchError((error, caught) => {
          this.logout()
          this.errorMessage$.next(`${error.error.message}`)

          return throwError(() => of(error))
        })
      )
  }

  logout() {
    this.isLoggedIn = false
    this.isLoggedIn$.next(this.isLoggedIn)

    kurses3Local.splice(0)
    kurses0Local.splice(0)
    kurses1Local.splice(0)
    kurses2Local.splice(0)
  }

  setLoggedIn() {
    this.isLoggedIn = true
    this.isLoggedIn$.next(this.isLoggedIn)
  }

  canActivate(): boolean {
    if (!this.isLoggedIn)
      this.router.navigate(['/']).then()
    return this.isLoggedIn
  }

  signUp(info: SignUpInfo): Observable<string> {
    return this.http.post<string>(this.signupUrl, info, httpOptions)
  }

}
