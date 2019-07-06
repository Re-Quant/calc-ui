import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-common-inputs-panel',
  templateUrl: './common-inputs-panel.component.html',
  styleUrls: ['./common-inputs-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonInputsPanelComponent {
  @Input()
  public group: FormGroup;

  @Output()
  public dataChange = new EventEmitter<void>();

  constructor() { }

  public onChange() {
    this.dataChange.emit();
  }
}
