import { Injectable } from '@angular/core';
import {priem_prod} from "../../model/priem_prod";
import {AgGridService} from "./ag-grid.service";

@Injectable({
  providedIn: 'root'
})
export class PpGridService extends AgGridService<priem_prod> {

  constructor() {
    super()
  }

}
