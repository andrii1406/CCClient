import { Injectable } from '@angular/core';
import {PrihRashAg} from "../../prih-rash/prih-rash.ag";
import {AgGridService} from "./ag-grid.service";

@Injectable({
  providedIn: 'root'
})
export class PrGridService extends AgGridService<PrihRashAg> {

  constructor() {
    super()
  }

}
