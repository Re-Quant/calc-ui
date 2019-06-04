import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'rc-entry-price',
  templateUrl: './entry-price.component.html',
  styleUrls: ['./entry-price.component.scss']
})
export class EntryPriceComponent implements OnInit {
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
