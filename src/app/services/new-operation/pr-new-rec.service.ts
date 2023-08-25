import { Injectable } from '@angular/core';
import {NewOperationService} from "./new-operation.service";
import {PrihRashModel} from "../../prih-rash/prih-rash.model";

@Injectable({
  providedIn: 'root'
})
export class PrNewRecService extends NewOperationService<PrihRashModel> {

  constructor() {
    super()
  }

}
