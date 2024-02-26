import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SingleFileUploadComponent } from 'src/app/shared/ui/button/single-file-upload.component';

@Component({
  standalone: true,
  imports: [CommonModule, SingleFileUploadComponent],
  template: `
    <div class="mx-2 grid justify-items-center">
      <single-file-upload></single-file-upload>
    </div>
  `,
})
export class FileUploadComponent implements OnInit {
  constructor(private _router: Router, private _actRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  public onBack(): void {
    this._router.navigateByUrl('/receiptreceiving/purchasenumber');
  }
}
