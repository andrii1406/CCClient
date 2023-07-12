import { Injectable } from '@angular/core';
import {NewOperationService} from "./new-operation.service";
import {priem_prod} from "../../model/priem_prod";

@Injectable({
  providedIn: 'root'
})
export class PpNewRecService extends NewOperationService<priem_prod>{

  constructor() {
    super()
  }

}
