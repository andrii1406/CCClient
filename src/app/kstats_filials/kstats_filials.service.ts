import { Injectable } from '@angular/core';
import {KstatsFilialsModel} from "./kstats_filials.model";

@Injectable({
  providedIn: 'root'
})
export class KstatsFilialsService {

  private _kfLocal: KstatsFilialsModel[] = []

  constructor() { }

  get kf(): KstatsFilialsModel[] {
    return this._kfLocal;
  }

  set kf(value: KstatsFilialsModel[]) {
    this._kfLocal = value;
  }

}
