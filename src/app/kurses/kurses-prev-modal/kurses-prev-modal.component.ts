import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'kurses-prev-modal',
  templateUrl: './kurses-prev-modal.component.html',
  styleUrls: ['./kurses-prev-modal.component.scss']
})
export class KursesPrevModalComponent {

  @Input() title = 'Default title'
  @Output() modalYes = new EventEmitter<void>()
  @Output() modalNo = new EventEmitter<void>()

}
