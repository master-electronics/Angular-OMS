import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'floating-input',
  templateUrl: './floating-input.component.html',
})
export class FloatingInputComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() control: string;
  @Input() box = 'text';
  @Input() label = 'text';
  @Input() maxlength = '20';
  @Input() errorMessage = 'Error';
  @Input() type = 'text';
  @Input() autocomplete = 'off';
  @Input() focus: Subject<boolean> = new Subject();

  @ViewChild('input') input: ElementRef;

  ngOnInit() {
    this.focus.subscribe((res) => {
      res ? this.input.nativeElement.select() : 0;
    });
  }
}
