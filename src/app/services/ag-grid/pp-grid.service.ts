import { Injectable } from '@angular/core';
import {AgGridService} from "./ag-grid.service";
import {PriemProdModel} from "../../priem-prod/priem-prod.model";

@Injectable({
  providedIn: 'root'
})
export class PpGridService extends AgGridService<PriemProdModel> {

  constructor() {
    super()
  }

}
