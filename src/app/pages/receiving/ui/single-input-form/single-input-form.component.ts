import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
  ],
  selector: 'single-input-form',
  templateUrl: './single-input-form.component.html',
})
export class SingleInputformComponent implements OnInit {
  public inputForm: FormGroup;
  @Input() controlName = 'input';
  @Input() type = 'text';
  @Input() placeholder = 'Input';
  @Input() title = 'Input';
  @Input() isLoading = false;
  @Output() onSubmit: EventEmitter<null> = new EventEmitter();
  @Output() onBack: EventEmitter<null> = new EventEmitter();

  constructor(private controlContainer: ControlContainer) {}

  public ngOnInit(): void {
    this.inputForm = this.controlContainer.control as FormGroup;
  }

  @ViewChild('input') containerInput!: ElementRef;
  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  public submit(): void {
    this.onSubmit.emit();
  }

  public back(): void {
    this.onBack.emit();
  }
}
