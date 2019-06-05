import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'rc-take-profit',
  templateUrl: './take-profit.component.html',
  styleUrls: ['./take-profit.component.scss']
})
export class TakeProfitComponent implements OnInit {
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
