import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  getIndexInVlLocalById,
  kurses0Local,
  kurses1Local,
  kurses2Local,
  kurses3Local, kursesLocalSplice
} from "../../localdata/kurses";
import {kurses} from "../../model/kurses";
import {currency} from "../../model/currency";
import {getVlLocalById, ppVlLocal} from "../../localdata/currencies";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {krsRegExp} from "../../localdata/patterns";
import {pp_obmen} from "../../model/pp_obmen";
import {getKrsObLocalById, krsObLocal} from "../../localdata/pp_obmen";
import {ObmenService} from "../../services/obmen.service";
import {KursesService} from "../../services/kurses.service";
import {FocusService} from "../../services/focus/focus.service";
import {LoginParamsService} from "../../services/login-params/login-params.service";
import {AuthService} from "../../services/jwt/auth.service";

@Component({
  selector: 'app-kurses',
  templateUrl: './kurses.component.html',
  styleUrls: ['./kurses.component.scss']
})
export class KursesComponent {

  listRows = 12

  krs0: kurses[] = kurses0Local
  krs1: kurses[] = kurses1Local
  krs2: kurses[] = kurses2Local
  krs3: currency[] = kurses3Local
  ppVl: currency[] = ppVlLocal
  krsOb: pp_obmen[] = krsObLocal

  formNewKrs = new FormGroup({
    krs0: new FormControl<kurses | null>(null, [Validators.pattern(krsRegExp)]),
    krs3: new FormControl<currency | null>(this.ppVl[0], []),
    krs1: new FormControl<kurses | null>(null, [Validators.pattern(krsRegExp)]),
    krs2: new FormControl<kurses | null>(null, [Validators.pattern(krsRegExp)]),
  })

  formListKrs = new FormGroup({
    krs0: new FormControl<kurses | null>(this.krs0[0], []),
    krs3: new FormControl<currency | null>(this.krs3[0], []),
    krs1: new FormControl<kurses | null>(this.krs1[0], []),
    krs2: new FormControl<kurses | null>(this.krs2[0], []),
  })

  formDisabled = new FormGroup({
    pp: new FormControl<pp_obmen | null>({value: null, disabled: true}, []),
    vl: new FormControl<currency | null>({value: null, disabled: true}, []),
  })

  formUpdKrs = new FormGroup({
    id: new FormControl<number | null>(null, []),
    np: new FormControl<number | null>(null, []),
    tv: new FormControl<number | null>(null, []),
    pp: new FormControl<pp_obmen | null>(null, []),
    vl: new FormControl<currency | null>(null, []),
    krs: new FormControl<number | null>(null, [Validators.pattern(krsRegExp)]),
    dt: new FormControl<Date | null>(null, []),
    fl: new FormControl<boolean | null>(null, []),
  })

  lastFocusedListRef: ElementRef | undefined
  lastSelectedKrsRow = -1

  @ViewChild('nKrs0') nKrs0Ref: ElementRef | undefined
  @ViewChild('nKrs1') nKrs1Ref: ElementRef | undefined
  @ViewChild('nKrs2') nKrs2Ref: ElementRef | undefined
  @ViewChild('nKrs3') nKrs3Ref: ElementRef | undefined

  @ViewChild('lKrs0') lKrs0Ref: ElementRef | undefined
  @ViewChild('lKrs1') lKrs1Ref: ElementRef | undefined
  @ViewChild('lKrs2') lKrs2Ref: ElementRef | undefined
  @ViewChild('lKrs3') lKrs3Ref: ElementRef | undefined

  @ViewChild('krsAddButton') krsAddButtonRef: ElementRef | undefined
  @ViewChild('krsUpdButton') krsUpdButtonRef: ElementRef | undefined
  @ViewChild('updKrsEdit') updKrsEditRef: ElementRef | undefined

  constructor(
    private obService: ObmenService,
    private krsService: KursesService,
    private focusService: FocusService,
    private lpService: LoginParamsService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    //когда осуществлён логин - инициализировать списки курсов
    this.authService.isLoggedIn$.subscribe((value) => {
      if (value) this.formListKrsControlsSetValues(0)
    })
  }

  onFocusList(listNum: number, ref: ElementRef | undefined) {
    this.lastFocusedListRef = ref
    this.onChangeList(listNum, ref)
  }

  //при двойном клике для установленного курса перейти в поле изменения,
  //в противном случае - в поле создания нового курса
  onDblClickList(fc: FormControl, refN: ElementRef | undefined, refU: ElementRef | undefined) {
    if (fc) {
      if(fc.value.id)
        refU?.nativeElement.focus()
      else {
        const vlId = this.formListKrs.controls.krs3.value?.id
        if (vlId !== undefined) {
          const vl = getVlLocalById(vlId)
          //корректная установка значения списка валют
          if (vl) this.formNewKrs.controls.krs3.setValue(vl)
          refN?.nativeElement.focus()
        }
      }
    }
  }

  onChangeList(listNum: number, ref: ElementRef | undefined) {
    if (ref !== undefined && ref !== null) {
      let refNe = ref.nativeElement

      if (refNe !== undefined && refNe !== null) {
        const index = refNe.selectedIndex

        if (index >= 0) {
          this.formListKrsControlsSetValues(index)
          this.lastSelectedKrsRow = index

          let fc = this.formListKrs.controls.krs0
          if (listNum === 1) fc = this.formListKrs.controls.krs1
          if (listNum === 2) fc = this.formListKrs.controls.krs2

          if (fc !== undefined && fc !== null) {
            const fcVal = fc.value
            if (fcVal) {
              //корректная установка значения списка операций
              const pp = getKrsObLocalById(fcVal.pp.id)
              if (pp) this.formDisabled.controls.pp.setValue(pp)

              //корректная установка значения списка валют
              const vl = getVlLocalById(fcVal.vl.id)
              if (vl) this.formDisabled.controls.vl.setValue(vl)

              this.formUpdKrs.setValue(fcVal)
            }
          }
        }
      }
    }
  }

  //выделить строку с курсами по индексу
  formListKrsControlsSetValues(index: number) {
    const ln = this.krs3.length
    if (ln > 0) {
      if (index < 0) index = 0
      if (index >= ln) index = ln - 1
      if (this.lKrs0Ref !== undefined) this.formListKrs.controls.krs0.setValue(this.krs0[index])
      if (this.lKrs3Ref !== undefined) this.formListKrs.controls.krs3.setValue(this.krs3[index])
      if (this.lKrs1Ref !== undefined) this.formListKrs.controls.krs1.setValue(this.krs1[index])
      if (this.lKrs2Ref !== undefined) this.formListKrs.controls.krs2.setValue(this.krs2[index])
    }
  }

  //для курса выделить последний символ
  onFocusEdit(ref: ElementRef | undefined) {
    this.focusService.SelectLastChar(ref)
  }

  //загрузка предыдущих курсов
  onLoadPrevKurses() {
    let b = true

    if (this.krs3.length > 0)
      if (!confirm("Перезаписать существующие курсы?")) b = false

    if (b) {
      const dtB = new Date(this.lpService.dtB.getTime() - 86400000)
      const dtE = new Date(this.lpService.dtE.getTime() - 86400000)
      this.krsService.readPrevByNpAndDt(this.lpService.npo, dtB, dtE, this.lpService.dtTm).subscribe((httpResponse) => {
        if (httpResponse) {
          const rb = httpResponse.body
          if (rb) {
            if (rb.length > 0) {
              this.krsService.deleteByNpAndDt(this.lpService.npo, this.lpService.dtB, this.lpService.dtE).subscribe(() => {
                kursesLocalSplice()
                this.krsService.create(rb).subscribe(() => {
                  this.formListKrsControlsSetValues(0)
                })
              })
            }
          }
        }
      })
    }
  }

  submitKrs() {
    const k0 = this.nKrs0Ref?.nativeElement.value
    const k1 = this.nKrs1Ref?.nativeElement.value
    const k2 = this.nKrs2Ref?.nativeElement.value

    if (k0 === '' && k1 === '' && k2 === '') {
      this.nKrs0Ref?.nativeElement.focus()
    }
    else {
      const vl = this.formNewKrs.controls.krs3.value

      if (vl) {
        let kNum: number[] = [0, 0, 0]

        if (!isNaN(Number(k0))) kNum[0] = Number(k0)
        if (!isNaN(Number(k1))) kNum[1] = Number(k1)
        if (!isNaN(Number(k2))) kNum[2] = Number(k2)

        let kursesList: kurses[] = []

        let i = -1
        this.krs3.forEach((value, index) => {if (vl.id === value.id) i = index})

        kNum.forEach((value, j) => {
          if (value !== 0) {
            let flag = true

            if (i >= 0)
              if ((j === 0 && this.krs0[i].id !== null) || (j === 1 && this.krs1[i].id !== null) ||
                (j === 2 && this.krs2[i].id !== null)) flag = false

            if (flag) {
              const np = this.lpService.npo
              const tv = this.lpService.tv
              const dtTm = this.lpService.dtTm
              kursesList.push(new kurses(null, np, tv, this.krsOb[j], vl, value, dtTm, false))
            }
          }
        })

        this.krsService.create(kursesList).subscribe(() => {
          this.formNewKrs.reset()
          this.formNewKrs.controls.krs3.setValue(vl)
          const index = getIndexInVlLocalById(vl.id)
          this.formListKrsControlsSetValues(index)
          this.nKrs0Ref?.nativeElement.focus()
        })
      }
    }
  }

  updKrs() {
    const updVal = <kurses>this.formUpdKrs.value

    if (updVal.id === null) {
      this.updKrsEditRef?.nativeElement.focus()
    }
    else {
      updVal.krs = Number(updVal.krs)

      this.krsService.update(updVal).subscribe(() => {
        this.formUpdKrs.reset()
        this.formListKrsControlsSetValues(this.lastSelectedKrsRow)
        this.updKrsEditRef?.nativeElement.focus()
      })
    }
  }

  krsOut(value: number ): string {
    return value === 0 ? '.' : String(value)
  }

}
