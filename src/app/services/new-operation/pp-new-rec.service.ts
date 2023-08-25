import { Injectable } from '@angular/core';
import {NewOperationService} from "./new-operation.service";
import {PriemProdModel} from "../../priem-prod/priem-prod.model";

@Injectable({
  providedIn: 'root'
})
export class PpNewRecService extends NewOperationService<PriemProdModel>{

  constructor() {
    super()
  }

}
