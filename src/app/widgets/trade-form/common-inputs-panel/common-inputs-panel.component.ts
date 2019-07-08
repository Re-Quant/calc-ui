import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-common-inputs-panel',
  templateUrl: './common-inputs-panel.component.html',
  styleUrls: ['./common-inputs-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonInputsPanelComponent {
  @Input()
  public form: FormGroup;
}
