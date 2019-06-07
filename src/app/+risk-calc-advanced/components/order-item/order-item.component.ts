import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { faChevronUp, faChevronDown, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderItemComponent {
  @Input()
  public group: FormGroup;

  public faChevronUp = faChevronUp;
  public faChevronDown = faChevronDown;
  public faPlusCircle = faPlusCircle;
  public faMinusCircle = faMinusCircle;
  public percentRange: string[] = ['10', '20', '25', '50', '75', '80', '100'];

  @Output()
  public dataChange = new EventEmitter<void>();

  constructor() { }

  public onChange() {
    this.dataChange.emit();
  }

  public addItemToTheTop() {
    console.log('top');
  }

  public addItemToTheBottom() {
    console.log('bottom');
  }

  public removeItem() {
    console.log('clear');
  }

  public setPercentage(value: string) {
    this.group.controls['percent'].setValue(value);
  }
}
