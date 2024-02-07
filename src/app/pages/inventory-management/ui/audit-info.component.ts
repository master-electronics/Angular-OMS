import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  Audit,
  AuditType,
  Inventory,
  Container,
  Product,
  ProductCode,
} from '../utils/interfaces';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  standalone: true,
  selector: 'audit-info',
  imports: [CommonModule, NzImageModule, NzGridModule, NzIconModule],
  template: `
    <div *ngIf="auditInfo">
      <div
        (click)="onArrow()"
        *ngIf="auditInfo.Inventory?.ITN"
        nz-row
        [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }"
      >
        <div nz-col nzSpan="6" class="text-black md:text-lg lg:text-xl">
          <span class="mr-2 font-medium">ITN:</span>
        </div>
        <div nz-col class="text-black md:text-lg lg:text-xl">
          <span class="justify-self-start text-blue-600">
            {{ auditInfo.Inventory.ITN }}
          </span>
        </div>
      </div>
      <div
        (click)="onArrow()"
        *ngIf="auditInfo.Container?.Barcode"
        nz-row
        [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }"
      >
        <div nz-col nzSpan="6" class="text-black md:text-lg lg:text-xl">
          <span class="mr-2 font-medium">Location:</span>
        </div>
        <div nz-col nzSpan="13" class="text-black md:text-lg lg:text-xl">
          <span class="justify-self-start text-blue-600">
            {{ auditInfo.Container.Barcode }}
          </span>
        </div>
        <div nz-col nzSpan="3" class="justify-self-center">
          <span
            *ngIf="!displayInfo"
            style="font-size: 24px"
            nz-icon
            nzType="down"
            nzTheme="outline"
          ></span>
          <span
            *ngIf="displayInfo"
            style="font-size: 24px"
            nz-icon
            nzType="up"
            nzTheme="outline"
          ></span>
        </div>
      </div>
      <ng-container *ngIf="displayInfo">
        <div
          *ngIf="auditInfo.Inventory?.Product?.ProductCode?.ProductCodeNumber"
          nz-row
          [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }"
        >
          <div nz-col nzSpan="6" class="text-black md:text-lg lg:text-xl">
            <span class="mr-2 font-medium">PRC:</span>
          </div>
          <div nz-col class="text-black md:text-lg lg:text-xl">
            <span class="justify-self-start text-blue-600">
              {{ auditInfo.Inventory.Product.ProductCode.ProductCodeNumber }}
            </span>
          </div>
        </div>
        <div
          *ngIf="auditInfo.Inventory?.Product?.PartNumber"
          nz-row
          [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }"
        >
          <div nz-col nzSpan="6" class="text-black md:text-lg lg:text-xl">
            <span class="mr-2 font-medium">Part</span>
          </div>
          <div nz-col class="text-black md:text-lg lg:text-xl">
            <span class="justify-self-start text-blue-600">
              {{ auditInfo.Inventory.Product.PartNumber }}
            </span>
          </div>
        </div>
        <div
          *ngIf="auditInfo.Inventory?.Product?.UOM"
          nz-row
          [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }"
        >
          <div nz-col nzSpan="6" class="text-black md:text-lg lg:text-xl">
            <span class="mr-2 font-medium">UOM:</span>
          </div>
          <div nz-col class="text-black md:text-lg lg:text-xl">
            <span class="justify-self-start text-blue-600">
              {{ auditInfo.Inventory.Product.UOM }}
            </span>
          </div>
        </div>
        <div
          *ngIf="auditInfo.Inventory?.Product?.PackQty"
          nz-row
          [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }"
        >
          <div nz-col nzSpan="6" class="text-black md:text-lg lg:text-xl">
            <span class="mr-2 font-medium">PK:</span>
          </div>
          <div nz-col class="text-black md:text-lg lg:text-xl">
            <span class="justify-self-start text-blue-600">
              {{ auditInfo.Inventory.Product.PackQty }}
            </span>
          </div>
        </div>
        <div
          *ngIf="auditInfo.Inventory?.Product?.SLC"
          nz-row
          [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }"
        >
          <div nz-col nzSpan="6" class="text-black md:text-lg lg:text-xl">
            <span class="mr-2 font-medium">SLC:</span>
          </div>
          <div nz-col class="text-black md:text-lg lg:text-xl">
            <span class="justify-self-start text-blue-600">
              {{ auditInfo.Inventory.Product.SLC }}
            </span>
          </div>
        </div>
        <div
          *ngIf="auditInfo.Inventory?.Product?.MSL"
          nz-row
          [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }"
        >
          <div nz-col nzSpan="6" class="text-black md:text-lg lg:text-xl">
            <span class="mr-2 font-medium">MSL:</span>
          </div>
          <div nz-col class="text-black md:text-lg lg:text-xl">
            <span class="justify-self-start text-blue-600">
              {{ auditInfo.Inventory.Product.MSL }}
            </span>
          </div>
        </div>
      </ng-container>
      <ng-container
        *ngIf="showGblMsg && auditInfo.Inventory?.Product?.GlobalMessages"
      >
        <div nz-row [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }">
          <div nz-col nzSpan="6" class="text-black md:text-lg lg:text-xl">
            <span class="mr-2 font-medium">Gbl Msg:</span>
          </div>
          <div nz-col class="text-black md:text-lg lg:text-xl">
            <div
              *ngFor="let msg of auditInfo.Inventory.Product.GlobalMessages"
              class="justify-self-start text-blue-600"
            >
              {{ msg.Message }}
            </div>
          </div>
        </div>
      </ng-container>

      <div nz-row [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }">
        <div nz-col nzSpan="12" nzOffset="6">
          <img
            nz-image
            nzSrc="https://www.onlinecomponents.com/images/parts/largeimages/{{
              auditInfo.Inventory.Product.MICPartNumber
            }}.jpg"
            [nzFallback]="fallback"
          />
        </div>
      </div>
    </div>
  `,
})
export class AuditInfoComponent {
  @Input() auditInfo: Audit;
  @Input() showGblMsg: boolean;
  fallback =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';
  displayInfo = false;

  onArrow() {
    this.displayInfo = !this.displayInfo;
  }
}
