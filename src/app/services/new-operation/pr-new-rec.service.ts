import { Injectable } from '@angular/core';
import {NewOperationService} from "./new-operation.service";
import {prih_rash_out} from "../../model/prih_rash_out";

@Injectable({
  providedIn: 'root'
})
export class PrNewRecService extends NewOperationService<prih_rash_out> {

  constructor() {
    super()
  }

}
