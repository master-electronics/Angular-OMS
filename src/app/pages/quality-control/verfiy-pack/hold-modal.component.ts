import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'hold-modal',
  templateUrl: './hold-modal.component.html',
})
export class HoldModalComponent {
  @Input() isModalHidden: boolean;
  @Output() isModalHiddenChange = new EventEmitter<boolean>();

  holdOptions = [
    { id: 1, content: 'Short Quantity' },
    { id: 2, content: 'Damaged' },
    { id: 3, content: 'Bad D/C' },
    { id: 4, content: 'Wrong Parts' },
    { id: 5, content: 'Waiting C of C' },
    { id: 6, content: 'Mixed Parts' },
    { id: 7, content: 'Hardware' },
    { id: 8, content: 'Non-Conforming' },
    { id: 9, content: 'Over Shipment' },
  ];

  onSubmit() {
    //
  }

  onCancel() {
    this.isModalHiddenChange.emit(true);
  }

  @ViewChild('modal') modal: ElementRef;

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    if (!this.modal.nativeElement.contains(event.target)) {
      this.onCancel();
    }
  }
}
