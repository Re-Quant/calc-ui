import { Component, HostBinding, Input } from '@angular/core';
import { EPricePointType, PricePoint } from '../../models';

@Component({
    selector: 'app-part-price',
    templateUrl: './part-price.component.html',
    styleUrls: [ './part-price.component.scss' ],
})
export class PartPriceComponent {

    @Input()
    public point?: PricePoint;

    @Input()
    public direction: 'left' | 'right' = 'left';

    @HostBinding('class.--direction-left')
    public get directionClassLeft(): boolean { return !!this.point && this.direction === 'left'; }

    @HostBinding('class.--direction-right')
    public get directionClassRight(): boolean { return !!this.point && this.direction === 'right'; }

    public isPointTypeStart(point: PricePoint): boolean {
        return point.type === EPricePointType.Start;
    }
}
