import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap, throwError} from "rxjs";
import {JwtResponse} from "../../model/jwt/jwt-response";
import {AuthLoginInfo} from "../../model/jwt/login-info";
import {SignUpInfo} from "../../model/jwt/signup-info";
import {Router} from "@angular/router";
import {TokenStorageService} from "./token-storage.service";
import {KursesService} from "../../kurses/kurses.service";

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
