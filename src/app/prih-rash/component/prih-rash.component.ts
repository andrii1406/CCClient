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
import {PrihRashService} from "../prih-rash.service";
import {PrOperationsService} from "../../pr_operations/pr_operations.service";
import {KstatsService} from "../../kstats/kstats.service";
import {CurrenciesService} from "../../currencies/currencies.service";
import {FilialsService} from "../../filials/filials.service";
import {SumIntl} from "../../localdata/formats";
import {PrNewRecService} from "../../services/new-operation/pr-new-rec.service";
import {PrGridService} from "../../services/ag-grid/pr-grid.service";
import {FocusService} from "../../services/focus/focus.service";
import {sumRegExp} from "../../localdata/patterns";
import {
  End,Enter, F1, Home, Tab,
  isKey_Enter_Delete, isKey_F1_F2,
  isKey_F1_F2_Enter_Delete,
  isKey_Home_End_PageUp_PageDown
} from "../../localdata/keys";
import {LoginParamsService} from "../../services/login-params/login-params.service";
import {GRID_END, prField} from "../../localdata/grid_constants";
import {AuthService} from "../../services/jwt/auth.service";
import {CurrenciesModel} from "../../currencies/currencies.model";
import {PrOperationsModel} from "../../pr_operations/pr_operations.model";
import {KstatsFilialsModel} from "../../kstats_filials/kstats_filials.model";
import {KstatsFilialsService} from "../../kstats_filials/kstats_filials.service";
import {PrihRashAg} from "../prih-rash.ag";
import {PrihRashMapper} from "../prih-rash.mapper";

@Component({
  selector: 'app-prih-rash',
  templateUrl: './prih-rash.component.html',
  styleUrls: ['./prih-rash.component.scss'],
})
export class PrihRashComponent {

  focusCol = prField[2]
  flag1 = false
  flag2 = false

  kf: KstatsFilialsModel[] = this.kfService.kf
  pr: PrOperationsModel[] = this.opService.pr_op

  public prihRowData:PrihRashAg[] = []
  public rashRowData:PrihRashAg[] = []

  private prihGridApi!: GridApi<PrihRashAg>
  private rashGridApi!: GridApi<PrihRashAg>

  private prihColumnApi!: ColumnApi
  private rashColumnApi!: ColumnApi

  private prihLastRowIndex: number | undefined
  private rashLastRowIndex: number | undefined

  //форма приход/расход
  formPrihRash = new FormGroup({
    id: new FormControl(0),
    npo: new FormControl(0),
    pr: new FormControl<PrOperationsModel | null>(null),
    sm: new FormControl(0,[Validators.required, Validators.pattern(sumRegExp)]),
    vl: new FormControl<CurrenciesModel | null>(null),
    dt: new FormControl(new Date()),
    kf: new FormControl<KstatsFilialsModel | null>(null),
    prim: new FormControl('Примечание', [Validators.maxLength(10)]),
    fl: new FormControl(false),
    dts: new FormControl(new Date())
  })

  // определения колонок грида
  public prColumnDefs: ColDef[] = [
    { headerName: 'Приход', field: prField[0], valueFormatter: params => (SumIntl.format(params.value)).replace(',', '.') },
    { headerName: 'Валюта', field: prField[1] },
    { headerName: 'Статья', field: prField[2] },
    { headerName: 'Прим.', field: prField[3] },
    { headerName: 'Дата', field: prField[4], valueFormatter: params => params.value.toLocaleString() }
  ]

  public pColumnDefs: ColDef[] = []
  public rColumnDefs: ColDef[] = []

  public prDefaultColDef: ColDef = {
    editable: false,
    sortable: true,
    resizable: true,
    filter: true,
    flex: 1,
    minWidth: 50
  }

  public pDefaultColDef:ColDef = {...this.prDefaultColDef}
  public rDefaultColDef:ColDef = {...this.prDefaultColDef}

  @ViewChild('prihGrid') pGridRef: ElementRef | undefined
  @ViewChild('rashGrid') rGridRef: ElementRef | undefined
  @ViewChild('prList') prListRef: ElementRef | undefined
  @ViewChild('vlList') vlListRef: ElementRef | undefined
  @ViewChild('smEdit') smEditRef: ElementRef | undefined
  @ViewChild('ksList') ksListRef: ElementRef | undefined
  @ViewChild('primEdit') primEditRef: ElementRef | undefined
  @ViewChild('submButton') submButtonRef: ElementRef | undefined
  @ViewChild('updButton') updButtonRef: ElementRef | undefined
  @ViewChild('delButton', { read: ElementRef }) delButtonRef: ElementRef | undefined
  @ViewChild('cancButton') cancButtonRef: ElementRef | undefined

  constructor(
    private mpr: PrihRashMapper,
    public prNewRec: PrNewRecService,
    private gridService: PrGridService,
    private prService: PrihRashService,
    public opService: PrOperationsService,
    private ksService: KstatsService,
    public crService: CurrenciesService,
    private cnService: FilialsService,
    private focusService: FocusService,
    private lpService: LoginParamsService,
    private authService: AuthService,
    private kfService: KstatsFilialsService,
  ) { }

  ngOnInit() {
    this.prColumnDefs.forEach((value) => {
      this.pColumnDefs.push({...value})
      this.rColumnDefs.push({...value})
    })
    this.rColumnDefs[0].headerName = 'Расход'

    //обработчик события изменения режима формы
    this.prNewRec.mode$.subscribe((value) => {
      //обнулить поля ввода - сумма и примечание
      if (value) {
        this.formPrihRash.controls.sm.setValue(0)
        this.formPrihRash.controls.prim.setValue('')
        if (this.kf.length > 0) this.formPrihRash.controls.kf.setValue(this.kf[0])
      }
    })

    //когда осуществлён логин - инициализировать выпадающие списки
    this.authService.isLoggedIn$.subscribe((value) => {
      if(value) {
        if (this.pr.length > 0) this.formPrihRash.controls.pr.setValue(this.pr[0])
        const prVl = this.crService.prVlLocal
        if (prVl.length > 3) this.formPrihRash.controls.vl.setValue(prVl[3])
        if (this.kf.length > 0) this.formPrihRash.controls.kf.setValue(this.kf[0])
      }
    })
  }

  ngOnDestroy() {
    this.gridService.lastSelectedGridApi = null
  }

  onPrihGridReady(event: GridReadyEvent) {
    this.prihGridApi = event.api
    this.prihColumnApi = event.columnApi
    this.RefreshGridData(0)
  }

  onRashGridReady(event: GridReadyEvent) {
    this.rashGridApi = event.api
    this.rashColumnApi = event.columnApi
    this.RefreshGridData(1)
  }

  //выделить весь текст
  onFocusSumPrimEdit(ref: ElementRef | undefined) {
    this.focusService.SelectAllText(ref)
  }

  //внесение новой операции
  submitForm() {
    if (this.formPrihRash.controls.sm.value === 0)
      this.smEditRef?.nativeElement.focus()
    else {
      this.formPrihRash.value.id = null
      this.formPrihRash.value.npo = this.lpService.npo
      this.formPrihRash.value.dt = this.lpService.dtTm
      this.formPrihRash.value.dts = null

      const prNew = {...<PrihRashAg>this.formPrihRash.value}
      const mode = prNew.pr.id
      const api = mode === 0 ? this.prihGridApi : this.rashGridApi

      this.prService.create(this.mpr.mapToEntity(prNew)).subscribe((httpResponse) => {
        if (httpResponse) {
          this.prNewRec.mode$.next(true)
          this.RefreshGridData(mode, api, GRID_END, this.focusCol)
        }
      })
    }
  }

  //изменение операции
  updateOperation() {
    const prUpd:PrihRashAg = {...<PrihRashAg>this.formPrihRash.value}
    const opOld = this.gridService.lastSelectedRow.pr.id
    const opNew = prUpd.pr.id
    const mode = opOld === opNew ? opNew : 2

    this.prService.update(this.mpr.mapToEntity(prUpd)).subscribe((httpResponse) => {
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
          //если операция стала приходной (а была расходной)
          let rowUndef
          if (opNew === 0) {
            api = this.prihGridApi
            rowUndef = this.prihLastRowIndex
          }
          //если операция стала расходной (а была приходной)
          else {
            api = this.rashGridApi
            rowUndef = this.rashLastRowIndex
          }
          if (rowUndef !== undefined) row = rowUndef
        }

        this.prNewRec.setMode(true)
        this.RefreshGridData(mode, api, row, this.focusCol)
      }
    })
  }

  //удаление операции
  deleteOperation() {
    this.prService.delete(this.formPrihRash.value.id).subscribe((httpResponse) => {
      if (httpResponse) {
        this.prNewRec.setMode(true)
        this.RefreshGridData(this.formPrihRash.value.pr?.id, this.gridService.lastSelectedGridApi, this.gridService.lastSelectedRowIndex!, this.focusCol)
      }
    })
  }

  //кнопка отмена
  cancel() {
    this.prNewRec.setMode(true)
    this.gridService.FocusCell(this.gridService.lastSelectedGridApi, this.gridService.lastSelectedRowIndex!, this.focusCol)
  }

  //обновление данных гридов
  RefreshGridData(mode: number | undefined, api?: GridApi<PrihRashAg> | null, row?: number | undefined, col?: string): void {
    // 0 - левый грид, 1 - правый грид, 2 - оба
    if (mode === 0 || mode === 2) {
      this.prService.readByPrAndNpoAndDt(0, this.lpService.npo, this.lpService.dtB, this.lpService.dtE).subscribe((httpResponse) => {
        if (httpResponse) {
          this.prihRowData = this.mpr.arrayToOut(this.prService.prih)
          this.prihGridApi.setRowData(this.prihRowData)
          this.gridService.autoSizeAll(this.prihColumnApi, true)

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
      this.prService.readByPrAndNpoAndDt(1, this.lpService.npo, this.lpService.dtB, this.lpService.dtE).subscribe((httpResponse) => {
        if (httpResponse) {
          this.rashRowData = this.mpr.arrayToOut(this.prService.rash)
          this.rashGridApi.setRowData(this.rashRowData)
          this.gridService.autoSizeAll(this.rashColumnApi, true)

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
    if(this.prihGridApi !== undefined && this.rashGridApi !== undefined) {
      if (this.prihGridApi.getModel().getRowCount() > 0)
        this.gridService.FocusCell(this.prihGridApi, GRID_END, this.focusCol)
      else {
        if (this.rashGridApi.getModel().getRowCount() > 0)
          this.gridService.FocusCell(this.rashGridApi, GRID_END, this.focusCol)
        else
          this.prListRef?.nativeElement.focus()
      }
    }
  }

  //запомнить последнюю позицию в приходном гриде
  rememberPrihRowIndex() {
    const api = this.prihGridApi
    this.prihLastRowIndex = api.getFocusedCell()?.rowIndex
    this.gridService.onSelectionChangedOrCellClicked(api, this.prihRowData)
  }

  //запомнить последнюю позицию в расходном гриде
  rememberRashRowIndex() {
    const api = this.rashGridApi
    this.rashLastRowIndex = api.getFocusedCell()?.rowIndex
    this.gridService.onSelectionChangedOrCellClicked(api, this.rashRowData)
  }

  //событие изменения выделения приходного грида
  onPrihSelectionChanged(event: SelectionChangedEvent<PrihRashAg>) {
    this.rememberPrihRowIndex()
  }

  //событие клика в ячейку приходного грида
  onPrihCellClicked(event: CellClickedEvent<PrihRashAg>) {
    this.rememberPrihRowIndex()
  }

  //событие изменения выделения расходного грида
  onRashSelectionChanged(event: SelectionChangedEvent<PrihRashAg>) {
    this.rememberRashRowIndex()
  }

  //событие клика в ячейку расходного грида
  onRashCellClicked(event: CellClickedEvent<PrihRashAg>) {
    this.rememberRashRowIndex()
  }

  //обработчик нажатия клавиш Tab, Home, End, PageUp, PageDown для грида
  agCellKeyDown($event: CellKeyDownEvent<PrihRashAg> | FullWidthCellKeyDownEvent<PrihRashAg>) {
    const e = <KeyboardEvent>$event.event
    const ek = e.key
    let api = $event.api

    if (isKey_F1_F2_Enter_Delete(ek)) {
      if (isKey_Enter_Delete(ek)) {
        if (e.ctrlKey) {
          this.onRowDoubleClicked($event)
        }

        if (ek === Enter)
          this.prListRef?.nativeElement.focus()
        else
          setTimeout(() => {
          this.delButtonRef?.nativeElement.focus()
          },0)

      }

      if (isKey_F1_F2(ek)) {
        this.formPrihRash.controls.pr.setValue(ek === F1 ? this.pr[0] : this.pr[1])
        this.vlListRef?.nativeElement.focus()
      }
    }

    if (isKey_Home_End_PageUp_PageDown(ek)) {
      let prCol = this.focusCol
      const cellPos = api.getFocusedCell()
      if (cellPos !== null) prCol = cellPos.column.getColId()
      if (ek === Home) prCol = prField[0]
      if (ek === End) prCol = prField[4]
      this.gridService.FocusCell(api, api.getFocusedCell()?.rowIndex, prCol)
    }

    if (ek === Tab) {
      let apiInv
      let rowUndef
      let row = GRID_END

      if (api === this.prihGridApi) {
        apiInv = this.rashGridApi
        rowUndef = this.rashLastRowIndex
      }
      else {
        apiInv = this.prihGridApi
        rowUndef = this.prihLastRowIndex
      }
      if (rowUndef !== undefined) row = rowUndef

      this.gridService.FocusCell(apiInv, row, this.focusCol)
    }
  }

  //событие фокусировки ячейки грида - по выбранной ячейке выделить всю строку
  onCellFocused($event: CellFocusedEvent<PrihRashAg>) {
    this.gridService.SelectRow($event.api, $event.rowIndex)
  }

  //событие нажатия клавиши Tab в ячейках с данными -
  //переопределить стандартное поведение в гриде
  tabToNextCell(params: TabToNextCellParams<PrihRashAg>): CellPosition | null {
    //вернуть фокус в исходное положение
    return params.previousCellPosition
  }

  //двойной клик в гриде
  onRowDoubleClicked(event: RowDoubleClickedEvent<PrihRashAg>) {
    const lsr = <PrihRashAg>this.gridService.lastSelectedRow
    //корректная установка значения списка статей
    this.kf.forEach((value) => {if (value.id === lsr.kf.id) lsr.kf = value})
    this.formPrihRash.setValue(lsr)
    this.prNewRec.setMode(false)
  }

}
