import { Component, Output, EventEmitter, Input } from '@angular/core';
import { LevelSliderComponent } from './level-slider.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'level-selector',
  template: `
    <button nz-button (click)="showLevelSelector()">
      <i
        nz-icon
        nzType="sliders"
        nzTheme="outline"
        title="Set Highlight Limits"
      ></i>
    </button>
    <nz-modal
      [(nzVisible)]="isVisible"
      nzTitle="Highlight Limits"
      (nzOnCancel)="handleCancel()"
      (nzOnOk)="handleOk()"
      [nzWidth]="520"
      nzClosable="false"
      (nzAfterClose)="handleClose()"
    >
      <ng-container *nzModalContent>
        <level-slider></level-slider>
      </ng-container>
    </nz-modal>
  `,
  standalone: true,
  imports: [
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    NzModalModule,
    LevelSliderComponent,
  ],
})
export class LevelSelectorComponent {
  isVisible = false;

  showLevelSelector(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleClose(): void {
    this.isVisible = false;
  }
}
