import {Component, ElementRef, ViewChild} from '@angular/core';
import {AuthLoginInfo} from "../../model/jwt/login-info";
import {AuthService} from "../../services/jwt/auth.service";
import {TokenStorageService} from "../../services/jwt/token-storage.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {LoginParamsService} from "../../services/login-params/login-params.service";
import {forkJoin, mergeMap} from "rxjs";
import {OperationService} from "../../services/operation.service";
import {CurrencyService} from "../../services/currency.service";
import {KstatService} from "../../services/kstat.service";
import {FilialService} from "../../services/filial.service";
import {ObmenService} from "../../services/obmen.service";
import {getFilialsLocalById} from "../../localdata/filials";
import {KursesService} from "../../kurses/kurses.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  isLoggedIn = false

  formLogin = new FormGroup({
    username: new FormControl({value: '', disabled: false}, []),
    password: new FormControl({value: '', disabled: false}, []),
    npo: new FormControl({value: '', disabled: false}),
    dt: new FormControl<string>({value: '', disabled: false})
  })

  @ViewChild('loginEdit') loginEditRef: ElementRef | undefined
  @ViewChild('passwordEdit') passwordEditRef: ElementRef | undefined
  @ViewChild('filialEdit') filialEditRef: ElementRef | undefined
  @ViewChild('workDate') workDateRef: ElementRef | undefined
  @ViewChild('loginButton') loginButtonRef: ElementRef | undefined

  constructor(public authService: AuthService,
              private router: Router,
              private tokenStorage: TokenStorageService,
              private obService: ObmenService,
              private ksService: KstatService,
              private cnService: FilialService,
              private crService: CurrencyService,
              private opService: OperationService,
              private lpService: LoginParamsService,
              private krsService: KursesService,
  ) {
    this.authService.isLoggedIn$.subscribe((value) => {
      this.isLoggedIn = value

      if (value)
        this.disableLoginForm()
      else
        this.enableLoginForm()
    })
  }

  ngOnInit() {
    // временная секция инициализации формы логина - что бы каждый раз не вводить руками
    const fc = this.formLogin.controls
    fc.username.setValue("admin")
    fc.password.setValue("123")
    fc.npo.setValue("10")

    //текущая дата ("yyyy-MM-dd") в календарь формы логина
    fc.dt.setValue(new Date().toLocaleDateString('en-CA'))

    if (this.tokenStorage.getToken()) {
      this.tokenStorage.signOut()
      this.authService.logout()
    }
  }

  enableLoginForm() {
    this.formLogin.get('username')?.enable()
    this.formLogin.get('password')?.enable()
    this.formLogin.get('npo')?.enable()
    this.formLogin.get('dt')?.enable()
    this.router.navigate(['/']).then()
  }

  disableLoginForm() {

    this.formLogin.get('username')?.disable()
    this.formLogin.get('password')?.disable()
    this.formLogin.get('npo')?.disable()
    this.formLogin.get('dt')?.disable()
    this.router.navigate(['/opr']).then()
  }

  onSubmit() {
    if (this.authService.isLoggedIn) {
      this.lpService.clearNpoAndTv()
      this.tokenStorage.signOut()
      this.authService.logout()
    }
    else {
      let login = this.formLogin.controls.username.value
      let pass = this.formLogin.controls.password.value

      if (login === null) login = ''
      if (pass === null) pass = ''

      let dtIsoBasic = this.formLogin.controls.dt.value
      if (dtIsoBasic === null) dtIsoBasic = new Date().toLocaleDateString('en-CA')
      this.lpService.initDates(dtIsoBasic)
      this.authService.attemptAuth(new AuthLoginInfo(login, pass))
        .pipe(
          mergeMap(() => {
            return forkJoin([
              //загрузка справочника видов операций
              this.opService.readAll(),
              //загрузка справочника валют
              this.crService.readAll(),
              //загрузка справочника статей
              this.ksService.readAll().pipe(
                //номера филиалов в статьи
                mergeMap(() => {
                  return this.cnService.readAll()
                })
              ),
              //загрузка справочника валютных операций
              this.obService.readAll()
            ])
              .pipe(
                mergeMap(() => {
                  //в данной точке уже отработало все, что в перечне forkJoin

                  //присутствует ли введенный номер филиала в базе
                  const fc = this.formLogin.controls
                  let npStr = fc.npo.value
                  const npNum = Number(npStr)
                  let np = isNaN(npNum) ? 0 : npNum
                  let tv = 0
                  const arrVal = getFilialsLocalById(np)
                  if (arrVal) {
                    np = arrVal.id
                    tv = arrVal.tv
                  }
                  else
                    np = 0

                  //записать информацию о введенном филиале в соответствующий сервис
                  this.lpService.rememberParams(np, tv, fc.dt.value)

                  //загрузка валютных курсов
                  return this.krsService.readByNpAndDt(this.lpService.npo, this.lpService.dtB, this.lpService.dtE)
                })
              )
          })
        )
        .subscribe(() => this.authService.setLoggedIn())
    }
  }

}
