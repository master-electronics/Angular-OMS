import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  standalone: true,
  selector: 'nav-drop-menu',
  imports: [NzDropDownModule],
  template: `
    <button
      class="inline-flex items-center justify-center rounded-md focus:outline-none"
      nz-dropdown
      nzTrigger="click"
      [nzDropdownMenu]="userMenu"
      nzPlacement="bottomLeft"
      #userButton
    >
      Username
    </button>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <ul nz-menu>
        <li nz-menu-item>
          <span class="text-lg font-bold"> Account </span>
        </li>
        <li nz-menu-item>
          <button (click)="clickLogout()">
            <div class="flex flex-row">
              <i nz-icon nzType="logout" nzTheme="outline" class="text-xl"></i>
              <span class="ml-2">Logout</span>
            </div>
          </button>
        </li>
      </ul>
    </nz-dropdown-menu>
  `,
})
export class NavbarDropMenuComponent {
  @Input() ItnList;
  @Output() logout: EventEmitter<null> = new EventEmitter();

  public clickLogout() {
    this.logout.emit();
  }
}
