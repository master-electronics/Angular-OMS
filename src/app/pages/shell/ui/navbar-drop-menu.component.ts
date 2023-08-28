import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  standalone: true,
  selector: 'nav-drop-menu',
  imports: [NzDropDownModule],
  template: `
    <button
      class="text-lg font-bold"
      nz-dropdown
      nzTrigger="click"
      [nzDropdownMenu]="userMenu"
      nzPlacement="bottomLeft"
      #userButton
    >
      {{ userName }}
    </button>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <ul nz-menu>
        <li nz-menu-item>
          <button (click)="clickLogout()">
            <div class="flex flex-row">
              <span>Logout</span>
            </div>
          </button>
        </li>
      </ul>
    </nz-dropdown-menu>
  `,
})
export class NavbarDropMenuComponent {
  @Input() userName: string;
  @Output() logout: EventEmitter<null> = new EventEmitter();

  public clickLogout() {
    this.logout.emit();
  }
}
