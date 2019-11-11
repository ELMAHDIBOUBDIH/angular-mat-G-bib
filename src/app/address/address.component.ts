import {Component, Input} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class AddressComponent {
  expanded = false;
  @Input() item;

  constructor(private fb: FormBuilder) {
  }

  more() {
    this.expanded = !this.expanded;
  }
}
