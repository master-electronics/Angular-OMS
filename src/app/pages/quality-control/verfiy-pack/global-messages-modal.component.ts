import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { QualityControlService } from '../quality-control.server';

@Component({
  selector: 'global-messages-modal',
  templateUrl: './global-messages-modal.component.html',
})
export class GlobalMessagesModalComponent implements AfterViewInit, OnInit {
  @Input() isMessagesModalHidden: boolean;
  @Output() isModalHiddenChange = new EventEmitter<boolean>();
  globalMessages: string[];

  constructor(private qcService: QualityControlService) {
    //
  }

  ngOnInit(): void {
    this.globalMessages = this.qcService.globalMessages;
  }

  onCancel(): void {
    this.isModalHiddenChange.emit(true);
  }

  @ViewChild('OKButton') OKButton: ElementRef;
  ngAfterViewInit(): void {
    this.OKButton.nativeElement.focus();
  }
  @ViewChild('modal') modal: ElementRef;
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    if (!this.modal.nativeElement.contains(event.target)) {
      this.onCancel();
    }
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Enter') {
      this.onCancel();
    }
  }
}
