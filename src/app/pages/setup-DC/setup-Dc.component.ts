import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { ChangeDcSettingGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    SubmitButtonComponent,
    NormalButtonComponent,
  ],
  template: `
    <div class="px-1 py-4">
      <h1 class="text-2xl">
        Current Distribution Center: {{ userInfo.distributionCenter }}
      </h1>
      <div
        *ngIf="update$ | async"
        class="grid h-64 grid-cols-2 justify-center gap-4 text-4xl md:gap-10 lg:gap-16"
      >
        <submit-button
          (buttonClick)="changeDc('PH')"
          buttonText="Phoenix"
        ></submit-button>
        <submit-button
          (buttonClick)="changeDc('CH')"
          buttonText="Chicago"
        ></submit-button>
        <normal-button (buttonClick)="onBack()"></normal-button>
      </div>
    </div>
  `,
})
export class SetupDcComponent {
  public update$;
  public userInfo = inject(StorageUserInfoService);
  private router = inject(Router);
  constructor(private _update: ChangeDcSettingGQL) {
    this.update$ = of(true);
  }

  changeDc(DistributionCenter: string): void {
    this.update$ = this._update
      .mutate({ DistributionCenter, UserID: this.userInfo.userId })
      .pipe(
        tap(() => {
          this.userInfo.saveUserInfo({
            ...this.userInfo.userInfo(),
            DistributionCenter,
          });
        })
      );
  }

  onBack(): void {
    this.router.navigateByUrl('/home');
  }
}
