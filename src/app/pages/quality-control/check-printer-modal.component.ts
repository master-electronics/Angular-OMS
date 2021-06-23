import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'check-printer-modal',
  templateUrl: './check-printer-modal.component.html',
})
export class CheckPrinterModalComponent {
  @Input() modalMessage: string;
  @Input() isModalHidden: boolean;
  @Output() isModalHiddenChange = new EventEmitter<boolean>();

  holdForm = this.fb.group({
    holdReason: [1, Validators.required],
  });
  constructor(private fb: FormBuilder, private router: Router) {
    //
  }
  checkForm = this.fb.group({});

  onSubmit(): void {
    this.isModalHiddenChange.emit(true);
    this.router.navigate(['/home']);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Enter') {
      this.onSubmit();
    }
  }
}
