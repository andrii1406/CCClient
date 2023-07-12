import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class NewOperationService<T> {

  _mode = true
  mode$ = new Subject<boolean>()

  constructor() {}

  getMode(): boolean {
    return this._mode
  }

  setMode(value: boolean): void {
    this._mode = value
    this.mode$.next(value)
  }

}
