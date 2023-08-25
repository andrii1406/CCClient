import { NgModule } from '@angular/core';
import {ReplaceCommaPipe} from "./replace-comma.pipe";

@NgModule({
  declarations: [
    ReplaceCommaPipe,
  ],
  exports: [
    ReplaceCommaPipe
  ],
})
export class ReplaceCommaModule { }
