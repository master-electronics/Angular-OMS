import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  standalone: true,
  imports: [CommonModule, NzButtonModule],
  selector: 'confirm-update',
  template: `
    <h1>The Current Country Of Origin is {{ original }}</h1>
    <h1>Your Input is {{ newValue }}</h1>
    <h1>Do you want to update the Value?</h1>
    <button
      nz-button
      nzSize="large"
      nzType="primary"
      nzLoading="state.loading"
      class="mr-20 w-32"
      (click)="onUpdate()"
    >
      Update
    </button>
    <button nz-button nzSize="large" type="button" (click)="onCancel()">
      Cancel
    </button>
  `,
})
export class ConfirmUpdateComponent {
  @Input() original = '';
  @Input() newValue = 'Input';
  @Output() formUpdate: EventEmitter<null> = new EventEmitter();
  @Output() formCancel: EventEmitter<null> = new EventEmitter();

  public onUpdate(): void {
    this.formUpdate.emit();
  }

  public onCancel(): void {
    this.formCancel.emit();
  }
}
