import {ChangeDetectorRef, Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  title = 'CCClient'

  constructor(private cd: ChangeDetectorRef) {}

  //это нужно для устранения ошибки NG0100: ExpressionChangedAfterItHasBeenCheckedError
  ngAfterContentChecked() {
    this.cd.detectChanges()
  }

}
