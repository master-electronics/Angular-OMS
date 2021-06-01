import { Component, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'fullscreen-button',
  templateUrl: './fullscreen-button.component.html',
})
export class FullscreenButtonComponent {
  elem;
  isFullscreen = false;
  isMobile = this.commonService.isMobile();

  @HostListener('document:fullscreenchange', []) chagne(): void {
    this.isFullscreen = !this.isFullscreen;
  }

  constructor(
    @Inject(DOCUMENT) private document: any,
    private commonService: CommonService
  ) {
    this.elem = document.documentElement;
  }

  openFullscreen(): void {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  closeFullscreen(): void {
    if (document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }
}
