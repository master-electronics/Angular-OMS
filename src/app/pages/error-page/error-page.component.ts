import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
})
export class ErrorPageComponent {
  error = this.route.snapshot.queryParams['err'] || 'Error';
  constructor(private route: ActivatedRoute) {}
}
