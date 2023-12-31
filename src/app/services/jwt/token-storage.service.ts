import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken'
const USERNAME_KEY = 'AuthUsername'
const AUTHORITIES_KEY = 'AuthAuthorities'

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  private roles: Array<string> = []

  constructor() {}

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY)
    window.sessionStorage.setItem(TOKEN_KEY, 'Bearer ' + token)
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY)
  }

  public saveUsername(username: string) {
    window.sessionStorage.removeItem(USERNAME_KEY)
    window.sessionStorage.setItem(USERNAME_KEY, username)
  }

  public getUsername(): string | null {
    return sessionStorage.getItem(USERNAME_KEY)
  }

  public saveAuthorities(authorities: string[]) {
    window.sessionStorage.removeItem(AUTHORITIES_KEY)
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities))
  }

  public getAuthorities(): string[] {
    this.roles = []

    if (sessionStorage.getItem(TOKEN_KEY)) {
      const authorities = sessionStorage.getItem(AUTHORITIES_KEY)
      if (authorities) {
        JSON.parse(authorities).forEach((authority: string) => {
          this.roles.push(authority)
        })
      }
    }

    return this.roles
  }

  signOut() {
    window.sessionStorage.clear()
  }

}
