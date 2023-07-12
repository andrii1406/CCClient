import { Injectable } from '@angular/core';
import {ColumnApi, GridApi} from "ag-grid-community";

@Injectable()
export class AgGridService<EntityType> {

  private _lastSelectedRow!: EntityType
  private _lastSelectedRowIndex: number | null = -1
  private _lastSelectedGridApi: GridApi<EntityType> | null = null
  private _rowData!: EntityType[]


  constructor() {}

  get lastSelectedRow(): EntityType {
    return this._lastSelectedRow;
  }

  set lastSelectedRow(value: EntityType) {
    this._lastSelectedRow = value;
  }

  get lastSelectedRowIndex(): number | null {
    return this._lastSelectedRowIndex;
  }

  set lastSelectedRowIndex(value: number | null) {
    this._lastSelectedRowIndex = value;
  }

  get lastSelectedGridApi(): GridApi<EntityType> | null {
    return this._lastSelectedGridApi;
  }

  set lastSelectedGridApi(value: GridApi<EntityType> | null){
    this._lastSelectedGridApi = value;
  }

  get rowData(): EntityType[] {
    return this._rowData;
  }

  set rowData(value: EntityType[]) {
    this._rowData = value;
  }

  //установить фокус в ячейку грида
  FocusCell(api: GridApi<EntityType> | null, row: number | undefined | null, col: string) {
    if (api !== undefined && api !== null) {
      if (api.getModel()) {
        if (!api.getModel().isEmpty()) {
          const rowCount = api.getModel().getRowCount()
          if (row !== undefined && row !== null) {
            let rowInd = row
            if (row < 0) rowInd = 0
            if (row >= rowCount) rowInd = rowCount - 1

            api.forEachNode((node) => {
              if (node.rowIndex === rowInd) {
                //прокрутить вертикальный scroll
                if (rowCount - 1 === rowInd) api.ensureIndexVisible(rowCount - 1)
                //установить фокус в ячейку
                api.setFocusedCell(rowInd, col)
              }
            })
          }
        }
      }
    }
  }

  //выделить всю строку по выбранной ячейке
  SelectRow(api: GridApi<EntityType>, rowIndex: number | null) {
    api.forEachNode((node) => {
      if (node.rowIndex === rowIndex) {
        //выделить строку
        node.setSelected(true)

        //запомнить объект EntityType выбранной строки
        this.rememberLastSelectedEntity(api)
      }
    })
  }

  //получить объект выбранной строки грида
  onSelectionChangedOrCellClicked(api: GridApi<EntityType>, rowData: EntityType[]) {
    //запомнить объект EntityType выбранной строки
    //this.rememberLastSelectedEntity(api)

    //запомнить api выбранного грида
    this._lastSelectedGridApi = api

    //запомнить указатель на массив с данными, кот. выводятся в грид
    this._rowData = rowData

    //запомнить номер последней выбранной строки последнего выбранного грида
    this._lastSelectedGridApi.forEachNode(rowNode => {
      if (rowNode.data === this._lastSelectedRow)
        this._lastSelectedRowIndex = rowNode.rowIndex
    })
  }

  //запомнить объект EntityType выбранной строки
  rememberLastSelectedEntity(api: GridApi<EntityType>) {
    //получить EntityType[] выбранных строк
    const selectedRows = api.getSelectedRows()
    this._lastSelectedRow = selectedRows[0]
  }

  //сделать ширину колонок по содержимому
  autoSizeAll(columnApi: ColumnApi, skipHeader: boolean) {
    const allColumnIds: string[] = [];
    columnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    columnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

}
