import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { Observable } from 'rxjs';
import { NzImageBasicComponent } from 'src/app/shared/ui/nz-image-basic.component';
import { environment } from 'src/environments/environment';
import { ReceivingService } from '../../data/receiving.server';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzSkeletonModule,
    NzDescriptionsModule,
    NzButtonModule,
    NzImageBasicComponent,
  ],
  templateUrl: './verify.component.html',
})
export class VerifyComponent {
  public fetchInfo$ = new Observable();
  public imgURL = environment.productImgSource;
  public isLoading = false;

  constructor(private _router: Router, private _service: ReceivingService) {
    _service.changeTab(2);
  }

  ngOnInit(): void {
    //
  }

  onSubmit(): void {
    //
  }

  kickout(): void {
    this._router.navigateByUrl('receiving/kickout');
  }

  back(): void {
    this._router.navigateByUrl('receiving/part');
  }
}
