import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ITNBarcodeRegex } from 'src/app/shared/dataRegex';

@Component({
  selector: 'scan-ITN',
  templateUrl: './scan-ITN.component.html',
})
export class ScanITNComponent implements OnInit {
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private _title: Title
  ) {
    this._title.setTitle('Sorting');
  }

  @ViewChild('ITN') ITNInput!: ElementRef;
  ITNForm = this._fb.group({
    ITN: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.alertType = this.route.snapshot.queryParams['type'];
    this.alertMessage = this.route.snapshot.queryParams['message'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ITNInput.nativeElement.select();
    }, 10);
  }

  back(): void {
    this._router.navigate(['/stocking']);
  }

  reprint(): void {
    //
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (this.ITNForm.invalid || this.isLoading) {
      return;
    }
    this._router.navigate(['/stocking/sorting-location']);
  }
}
