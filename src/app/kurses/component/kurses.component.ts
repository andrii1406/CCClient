import {Component, ElementRef, ViewChild} from '@angular/core';
import {currency} from "../../model/currency";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {krsRegExp} from "../../localdata/patterns";
import {pp_obmen} from "../../model/pp_obmen";
import {getKrsObLocalById, krsObLocal} from "../../localdata/pp_obmen";
import {ObmenService} from "../../services/obmen.service";
import {KursesService} from "../kurses.service";
import {FocusService} from "../../services/focus/focus.service";
import {LoginParamsService} from "../../services/login-params/login-params.service";
import {KursesModel} from "../kurses.model";
import {CurrencyService} from "../../services/currency.service";

@Component({
  selector: 'app-kurses',
  templateUrl: './kurses.component.html',
  styleUrls: ['./kurses.component.scss']
})
export class KursesComponent {

  listRows = 12
  krsOb: pp_obmen[] = krsObLocal

  formNewKrs = new FormGroup({
    krs0: new FormControl<KursesModel | null>(null, [Validators.pattern(krsRegExp)]),
    krs3: new FormControl<currency | null>(null, []),
    krs1: new FormControl<KursesModel | null>(null, [Validators.pattern(krsRegExp)]),
    krs2: new FormControl<KursesModel | null>(null, [Validators.pattern(krsRegExp)]),
  })

  formListKrs = new FormGroup({
    krs0: new FormControl<KursesModel | null>(null, []),
    krs3: new FormControl<currency | null>(null, []),
    krs1: new FormControl<KursesModel | null>(null, []),
    krs2: new FormControl<KursesModel | null>(null, []),
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
    public krsService: KursesService,
    public curService: CurrencyService,
    private focusService: FocusService,
    private lpService: LoginParamsService,
  ) {}

  // Lifecycle hook handler
  ngAfterViewInit() {
    // Initialize the currency name list of the new currency rate form
    const ppVl = this.curService.ppVlLocal
    if (ppVl.length > 0) this.formNewKrs.controls.krs3.setValue(ppVl[0])

    // Initial focus setting
    this.nKrs0Ref?.nativeElement.focus()
    this.formListKrsControlsSetValues(0)
  }

  // Rates list - focus event handler
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
        const vl = this.formListKrs.controls.krs3.value
        if (vl) {
          this.formNewKrs.controls.krs3.setValue(this.curService.getPpVlLocalById(vl))
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

              this.formDisabled.controls.vl.setValue(this.curService.getPpVlLocalById(fcVal.vl))

              this.formUpdKrs.setValue(fcVal)
            }
          }
        }
      }
    }
  }

  // Select row with all rates by 'index' value
  formListKrsControlsSetValues(index: number) {
    const ln = this.krsService.kurses3Local.length
    if (ln > 0) {
      if (index < 0) index = 0
      if (index >= ln) index = ln - 1
      this.formListKrs.controls.krs0.setValue(this.krsService.kurses0Local[index])
      this.formListKrs.controls.krs3.setValue(this.krsService.kurses3Local[index])
      this.formListKrs.controls.krs1.setValue(this.krsService.kurses1Local[index])
      this.formListKrs.controls.krs2.setValue(this.krsService.kurses2Local[index])
    }
  }

  // Select rate last digit
  onFocusEdit(ref: ElementRef | undefined) {
    this.focusService.SelectLastChar(ref)
  }

  // Loading of previous rates
  onLoadPrevKurses() {
    let b = true

    if (this.krsService.kurses3Local.length > 0)
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
                this.krsService.kursesLocalSplice()
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

        let kursesList: KursesModel[] = []

        let i = -1
        this.krsService.kurses3Local.forEach((value, index) => {
          if (vl.id === value.id) i = index
        })

        kNum.forEach((value, j) => {
          if (value !== 0) {
            let flag = true

            if (i >= 0)
              if ((j === 0 && this.krsService.kurses0Local[i].id !== null) ||
                (j === 1 && this.krsService.kurses1Local[i].id !== null) ||
                (j === 2 && this.krsService.kurses2Local[i].id !== null)) flag = false

            if (flag) {
              const np = this.lpService.npo
              const tv = this.lpService.tv
              const dtTm = this.lpService.dtTm
              kursesList.push(new KursesModel(null, np, tv, this.krsOb[j], vl, value, dtTm, false))
            }
          }
        })

        this.krsService.create(kursesList).subscribe(() => {
          this.formNewKrs.reset()
          this.formNewKrs.controls.krs3.setValue(vl)
          const index = this.krsService.getIndexInVlLocalById(vl.id)
          this.formListKrsControlsSetValues(index)
          this.nKrs0Ref?.nativeElement.focus()
        })
      }
    }
  }

  updKrs() {
    const updVal = <KursesModel>this.formUpdKrs.value

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
