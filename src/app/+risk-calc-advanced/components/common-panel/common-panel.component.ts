import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-common-panel',
  templateUrl: './common-panel.component.html',
  styleUrls: ['./common-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonPanelComponent implements OnInit {
  @Input()
  public group: FormGroup;

  @Output()
  public dataChange = new EventEmitter<void>();

  constructor() { }

  public ngOnInit() {
  }

  public onChange() {
    this.dataChange.emit();
  }
}
