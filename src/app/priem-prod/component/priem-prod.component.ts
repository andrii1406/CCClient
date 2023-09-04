import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {
  CellClickedEvent,
  CellFocusedEvent,
  CellKeyDownEvent,
  CellPosition,
  ColDef, ColumnApi,
  FullWidthCellKeyDownEvent,
  GridApi,
  GridReadyEvent,
  RowDoubleClickedEvent,
  SelectionChangedEvent,
  TabToNextCellParams
} from "ag-grid-community";
import {PpObmensService} from "../../pp_obmens/pp_obmens.service";
import {CurrenciesService} from "../../currencies/currencies.service";
import {KrsIntl, SumIntl} from "../../localdata/formats";
import {PriemProdService} from "../priem-prod.service";
import {PpNewRecService} from "../../services/new-operation/pp-new-rec.service";
import {PpGridService} from "../../services/ag-grid/pp-grid.service";
import {krsRegExp, sumRegExp} from "../../localdata/patterns";
import {FocusService} from "../../services/focus/focus.service";
import {
  Enter, F1, Tab,
  isKey_Enter_Delete,
  isKey_F1_F2,
  isKey_F1_F2_Enter_Delete,
  isKey_Home_End_PageUp_PageDown
} from "../../localdata/keys";
import {LoginParamsService} from "../../services/login-params/login-params.service";
import {GRID_END, ppField} from "../../localdata/grid_constants";
import {AuthService} from "../../services/jwt/auth.service";
import {KursesService} from "../../kurses/kurses.service";
import {CurrenciesModel} from "../../currencies/currencies.model";
import {PpObmensModel} from "../../pp_obmens/pp_obmens.model";
import {PriemProdModel} from "../priem-prod.model";

@Component({
  selector: 'app-component',
  templateUrl: './priem-prod.component.html',
  styleUrls: ['./priem-prod.component.scss']
})
export class PriemProdComponent {

  totalSum = 0
  focusCol = ppField[2]
  flag1 = false
  flag2 = false

  pp: PpObmensModel[] = this.obService.pp_ob

  public priemRowData:PriemProdModel[] = []
  public prodRowData:PriemProdModel[] = []

  private priemGridApi!: GridApi<PriemProdModel>
  private prodGridApi!: GridApi<PriemProdModel>

  private priemColumnApi!: ColumnApi
  private prodColumnApi!: ColumnApi

  private priemLastRowIndex: number | undefined
  private prodLastRowIndex: number | undefined

  //форма приём/продажа
  formPriemProd = new FormGroup({
    id: new FormControl(0),
    np: new FormControl(0),
    pp: new FormControl<PpObmensModel | null>(null),
    sm: new FormControl(0,[Validators.required, Validators.pattern(sumRegExp)]),
    vl: new FormControl<CurrenciesModel | null>(null),
    krs: new FormControl(0,[Validators.required, Validators.pattern(krsRegExp)]),
    dt: new FormControl(new Date()),
    fl: new FormControl(false),
    dts: new FormControl(new Date())
  })

  // определения колонок грида
  public ppColumnDefs: ColDef[] = [
    { headerName: 'Приём', field: ppField[0], valueFormatter: params => (SumIntl.format(params.value)).replace(',', '.') },
    { headerName: 'Валюта', field: ppField[1]},
    { headerName: 'Курс', field: ppField[2], valueFormatter: params => (KrsIntl.format(params.value)).replace(',', '.') },
    { headerName: 'Дата', field: ppField[3], valueFormatter: params => params.value.toLocaleString() }
  ]

  public priemColumnDefs: ColDef[] = []
  public prodColumnDefs: ColDef[] = []

  public ppDefaultColDef: ColDef = {
    editable: false,
    sortable: true,
    resizable: true,
    suppressSizeToFit: true,
    filter: true,
    flex: 1,
    minWidth: 40
  }

  public priemDefaultColDef:ColDef = {...this.ppDefaultColDef}
  public prodDefaultColDef:ColDef = {...this.ppDefaultColDef}

  @ViewChild('priemGrid') priemGridRef: ElementRef | undefined
  @ViewChild('prodGrid') prodGridRef: ElementRef | undefined
  @ViewChild('ppList') ppListRef: ElementRef | undefined
  @ViewChild('ppSmEdit') smEditRef: ElementRef | undefined
  @ViewChild('ppVlList') vlListRef: ElementRef | undefined
  @ViewChild('ppKrsEdit') krsEditRef: ElementRef | undefined
  @ViewChild('ppSubmButton') submButtonRef: ElementRef | undefined
  @ViewChild('ppUpdButton') updButtonRef: ElementRef | undefined
  @ViewChild('ppDelButton') delButtonRef: ElementRef | undefined
  @ViewChild('ppCancButton') cancButtonRef: ElementRef | undefined

  constructor(
    public ppNewRec: PpNewRecService,
    private gridService: PpGridService,
    private ppService: PriemProdService,
    private obService: PpObmensService,
    private krsService: KursesService,
    public crService: CurrenciesService,
    private focusService: FocusService,
    private lpService: LoginParamsService,
    private authService: AuthService,
  ) { }

  ngOnInit() {

    this.onSumKrsChange()

    this.ppColumnDefs.forEach((value) => {
      this.priemColumnDefs.push({...value})
      this.prodColumnDefs.push({...value})
    })
    this.prodColumnDefs[0].headerName = 'Продажа'

    //обработчик события изменения режима формы
    this.ppNewRec.mode$.subscribe((value) => {
      //обнулить поля ввода - сумма и курс
      if (value) {
        this.formPriemProd.controls.sm.setValue(0)
        this.formPriemProd.controls.krs.setValue(0)
        this.onSumKrsChange()
      }
    })

    //когда осуществлён логин - инициализировать выпадающие списки
    this.authService.isLoggedIn$.subscribe((value) => {
      if(value) {
        if (this.pp.length > 0) this.formPriemProd.controls.pp.setValue(this.pp[0])
        const ppVl = this.crService.ppVlLocal
        if (ppVl.length > 0) this.formPriemProd.controls.vl.setValue(ppVl[0])
      }
    })
  }

  ngOnDestroy() {
    this.gridService.lastSelectedGridApi = null
  }

  onPriemGridReady(event: GridReadyEvent) {
    this.priemGridApi = event.api
    this.priemColumnApi = event.columnApi
    this.RefreshGridData(0)
  }

  onProdGridReady(event: GridReadyEvent) {
    this.prodGridApi = event.api
    this.prodColumnApi = event.columnApi
    this.RefreshGridData(1)
  }

  //установить соответствующий валютный курс и выделить последный символ
  onFocusKrsEdit(ref: ElementRef | undefined) {
    if (this.ppNewRec.getMode()) {
      const ppId = this.formPriemProd.controls.pp.value?.id
      const vlId = this.formPriemProd.controls.vl.value?.id
      const ap = this.krsService.getServiceLocalArrayPointer(ppId)
      if (ap) {
        let krs: number | null = null
        ap.forEach((value) => {
          if (vlId === value.vl.id) krs = value.krs
        })
        if (krs) this.formPriemProd.controls.krs.setValue(krs)
      }
    }
    this.focusService.SelectLastChar(ref)
  }

  //выделить весь текст
  onFocusSumEdit(ref: ElementRef | undefined) {
    this.focusService.SelectAllText(ref)
  }

  //внесение новой операции обмена
  submitForm() {
    if (this.formPriemProd.controls.sm.value === 0)
      this.smEditRef?.nativeElement.focus()
    else
      if (this.formPriemProd.controls.krs.value === 0)
        this.krsEditRef?.nativeElement.focus()
    else {
        this.formPriemProd.value.id = null
        this.formPriemProd.value.np = this.lpService.npo
        this.formPriemProd.value.dt = this.lpService.dtTm
        this.formPriemProd.value.dts = null

        const ppNew = {...<PriemProdModel>this.formPriemProd.value}
        const mode = ppNew.pp.id
        const api = mode === 0 ? this.priemGridApi : this.prodGridApi

        this.ppService.create(ppNew).subscribe((httpResponse) => {
          if (httpResponse) {
            this.ppNewRec.mode$.next(true)
            this.RefreshGridData(mode, api, GRID_END, this.focusCol)
          }
        })
      }
  }

  //изменение операции обмена
  updateOperation() {
    const ppUpd:PriemProdModel = {...<PriemProdModel>this.formPriemProd.value}
    const opOld = this.gridService.lastSelectedRow.pp.id
    const opNew = ppUpd.pp.id
    const mode = opOld === opNew ? opNew : 2

    this.ppService.update(ppUpd).subscribe((httpResponse) => {
      if (httpResponse) {
        let api = this.gridService.lastSelectedGridApi
        let row = GRID_END
        let lsrInd = this.gridService.lastSelectedRowIndex

        //установить фокус по условиям при изменении операции

        //если не поменялся тип операции
        if (opOld === opNew) {
          if (lsrInd !== null) row = lsrInd
        }
        //если поменялся тип операции
        else {
          //если операция стала приём (а была продажа)
          let rowUndef
          if (opNew === 0) {
            api = this.priemGridApi
            rowUndef = this.priemLastRowIndex
          }
          //если операция стала продажа (а была приём)
          else {
            api = this.prodGridApi
            rowUndef = this.prodLastRowIndex
          }
          if (rowUndef !== undefined) row = rowUndef
        }

        this.ppNewRec.setMode(true)
        this.RefreshGridData(mode, api, row, this.focusCol)
      }
    })
  }

  //удаление операции обмена
  deleteOperation() {
    this.ppService.delete(this.formPriemProd.value.id).subscribe((httpResponse) => {
      if (httpResponse) {
        this.ppNewRec.setMode(true)
        this.RefreshGridData(this.formPriemProd.value.pp?.id, this.gridService.lastSelectedGridApi, this.gridService.lastSelectedRowIndex!, this.focusCol)
      }
    })
  }

  //кнопка отмена
  cancel() {
    this.ppNewRec.setMode(true)
    this.gridService.FocusCell(this.gridService.lastSelectedGridApi, this.gridService.lastSelectedRowIndex, this.focusCol)
  }

  //обновление данных гридов
  RefreshGridData(mode: number | undefined, api?: GridApi<PriemProdModel> | null, row?: number | undefined, col?: string): void {
    // 0 - левый грид, 1 - правый грид, 2 - оба
    if (mode === 0 || mode === 2) {
      this.ppService.readByPpAndNpAndDt(0, this.lpService.npo, this.lpService.dtB, this.lpService.dtE).subscribe((httpResponse) => {
        if (httpResponse) {
          this.priemRowData = this.ppService.priem
          this.priemGridApi.setRowData(this.priemRowData)
          this.gridService.autoSizeAll(this.priemColumnApi, false)

          if (api != undefined && row !== undefined && col !== undefined)
            this.gridService.FocusCell(api, row, col)
          else {
            this.flag1 = true
            if (this.flag1 && this.flag2) this.setFocus()
          }
        }
      })
    }
    if (mode === 1 || mode === 2) {
      this.ppService.readByPpAndNpAndDt(1, this.lpService.npo, this.lpService.dtB, this.lpService.dtE).subscribe((httpResponse) => {
        if (httpResponse) {
          this.prodRowData = this.ppService.prod
          this.prodGridApi.setRowData(this.prodRowData)
          this.gridService.autoSizeAll(this.prodColumnApi, false)

          if (api != undefined && row !== undefined && col !== undefined)
            this.gridService.FocusCell(api, row, col)
          else {
            this.flag2 = true
            if (this.flag1 && this.flag2) this.setFocus()
          }
        }
      })
    }
  }

  //начальная установка фокуса
  setFocus() {
    if(this.priemGridApi !== undefined && this.prodGridApi !== undefined) {
      if (this.priemGridApi.getModel().getRowCount() > 0)
        this.gridService.FocusCell(this.priemGridApi, GRID_END, this.focusCol)
      else {
        if (this.prodGridApi.getModel().getRowCount() > 0)
          this.gridService.FocusCell(this.prodGridApi, GRID_END, this.focusCol)
        else
          this.ppListRef?.nativeElement.focus()
      }
    }
  }

  //запомнить последнюю позицию в гриде приемов
  rememberPriemRowIndex() {
    const api = this.priemGridApi
    this.priemLastRowIndex = api.getFocusedCell()?.rowIndex
    this.gridService.onSelectionChangedOrCellClicked(api, this.priemRowData)
  }

  //запомнить последнюю позицию в гриде продаж
  rememberProdRowIndex() {
    const api = this.prodGridApi
    this.prodLastRowIndex = api.getFocusedCell()?.rowIndex
    this.gridService.onSelectionChangedOrCellClicked(api, this.prodRowData)
  }

  //событие изменения выделения грида приемов
  onPriemSelectionChanged(event: SelectionChangedEvent<PriemProdModel>) {
    this.rememberPriemRowIndex()
  }

  //событие клика в ячейку грида приемов
  onPriemCellClicked(event: CellClickedEvent<PriemProdModel>) {
    this.rememberPriemRowIndex()
  }

  //событие изменения выделения грида продаж
  onProdSelectionChanged(event: SelectionChangedEvent<PriemProdModel>) {
    this.rememberProdRowIndex()
  }

  //событие клика в ячейку грида продаж
  onProdCellClicked(event: CellClickedEvent<PriemProdModel>) {
    this.rememberProdRowIndex()
  }

  //обработчик нажатия клавиш Tab, Home, End, PageUp, PageDown для грида
  agCellKeyDown($event: CellKeyDownEvent<PriemProdModel> | FullWidthCellKeyDownEvent<PriemProdModel>) {
    const e = <KeyboardEvent>$event.event
    const ek = e.key
    let api = $event.api

    if (isKey_F1_F2_Enter_Delete(ek)) {
      if (isKey_Enter_Delete(ek)) {
        if (e.ctrlKey) {
          this.onRowDoubleClicked($event)
        }

        if (ek === Enter)
          this.ppListRef?.nativeElement.focus()
        else
          setTimeout(() => {
            this.delButtonRef?.nativeElement.focus()
          },0)
      }

      if (isKey_F1_F2(ek)) {
        this.formPriemProd.controls.pp.setValue(ek === F1 ? this.pp[0] : this.pp[1])
        this.vlListRef?.nativeElement.focus()
      }
    }

    if (isKey_Home_End_PageUp_PageDown(ek)) {
      let ppCol = this.focusCol
      const cellPos = api.getFocusedCell()
      if (cellPos !== null) ppCol = cellPos.column.getColId()
      if (ek === "Home") ppCol = ppField[0]
      if (ek === "End") ppCol = ppField[3]
      this.gridService.FocusCell(api, api.getFocusedCell()?.rowIndex, ppCol)
    }

    if (ek === Tab) {
      let apiInv
      let rowUndef
      let row = GRID_END

      if (api === this.priemGridApi) {
        apiInv = this.prodGridApi
        rowUndef = this.prodLastRowIndex
      }
      else {
        apiInv = this.priemGridApi
        rowUndef = this.priemLastRowIndex
      }
      if (rowUndef !== undefined) row = rowUndef

      this.gridService.FocusCell(apiInv, row, this.focusCol)
    }
  }

  //событие фокусировки ячейки грида - по выбранной ячейке выделить всю строку
  onCellFocused($event: CellFocusedEvent<PriemProdModel>) {
    this.gridService.SelectRow($event.api, $event.rowIndex)
  }

  //событие нажатия клавиши Tab в ячейках с данными -
  //переопределить стандартное поведение в гриде
  tabToNextCell(params: TabToNextCellParams<PriemProdModel>): CellPosition | null {
    //вернуть фокус в исходное положение
    return params.previousCellPosition
  }

  //двойной клик в гриде
  onRowDoubleClicked(event: RowDoubleClickedEvent<PriemProdModel>) {
    const lsr = <PriemProdModel>this.gridService.lastSelectedRow
    this.formPriemProd.setValue(lsr)
    this.ppNewRec.setMode(false)
    this.onSumKrsChange()
  }

  //обработчик изменения полей ввода суммы и курса
  onSumKrsChange() {
    const sum = this.formPriemProd.value.sm
    const krs = this.formPriemProd.value.krs
    if (sum !== null && sum !== undefined && krs !== null && krs !== undefined)
      this.totalSum = sum * krs
  }

}
