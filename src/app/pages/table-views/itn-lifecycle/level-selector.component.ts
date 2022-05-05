import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'level-selector',
    template: `
        <button nz-button (click)="showLevelSelector()"><i nz-icon nzType="sliders" nzTheme="outline" title="Set Highlight Limits"></i></button>
        <nz-modal [(nzVisible)]="isVisible" nzTitle="Highlight Limits"
            (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()"
            [nzWidth]="520" nzClosable="false"
            (nzAfterClose)="handleClose()">
            <ng-container *nzModalContent>
                <level-slider></level-slider>
            </ng-container>
        </nz-modal>
    `,
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