import { Injectable } from '@angular/core';
import {prih_rash_out} from "../../model/prih_rash_out";
import {AgGridService} from "./ag-grid.service";

@Injectable({
  providedIn: 'root'
})
export class PrGridService extends AgGridService<prih_rash_out> {

  constructor() {
    super()
  }

}
