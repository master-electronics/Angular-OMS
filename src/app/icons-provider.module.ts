import { NgModule } from '@angular/core';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

import {
  UserOutline,
  MenuFoldOutline,
  HomeOutline,
  FullscreenOutline,
  FullscreenExitOutline,
  LogoutOutline,
  LockOutline,
  SearchOutline,
} from '@ant-design/icons-angular/icons';

const icons = [
  UserOutline,
  MenuFoldOutline,
  HomeOutline,
  FullscreenOutline,
  FullscreenExitOutline,
  LogoutOutline,
  LockOutline,
  SearchOutline,
];

@NgModule({
  imports: [NzIconModule],
  exports: [NzIconModule],
  providers: [{ provide: NZ_ICONS, useValue: icons }],
})
export class IconsProviderModule {}
