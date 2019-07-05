import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-common-panel',
  templateUrl: './common-panel.component.html',
  styleUrls: ['./common-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonPanelComponent {
  @Input()
  public group: FormGroup;

  @Output()
  public dataChange = new EventEmitter<void>();

  constructor() { }

  public onChange() {
    this.dataChange.emit();
  }
}
