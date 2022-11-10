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
import { HttpRequestState } from 'src/app/shared/data/interface';
import { AlertBarComponent } from 'src/app/shared/ui/alert-bar.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    AlertBarComponent,
  ],
  selector: 'single-input-form',
  templateUrl: './single-input-form.component.html',
})
export class SingleInputformComponent implements OnInit {
  public inputForm: FormGroup;
  @Input()
  state: HttpRequestState<any>;
  @Input() validator = { name: '', message: '' };
  @Input() controlName = 'input';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() title = 'Input';
  @Input() isLoading = false;
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() back: EventEmitter<null> = new EventEmitter();

  constructor(private controlContainer: ControlContainer) {}

  public ngOnInit(): void {
    this.inputForm = this.controlContainer.control as FormGroup;
  }

  @ViewChild('input') containerInput!: ElementRef;
  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  public onSubmit(): void {
    this.submit.emit();
  }

  public onBack(): void {
    this.back.emit();
  }
}
