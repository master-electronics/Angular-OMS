import { Injectable, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import { FindWeightScaleConfigGQL } from 'src/app/graphql/qualityControl.graphql-gen';
import { SESSION_STORAGE } from 'src/app/shared/utils/storage';

@Injectable({
  providedIn: 'root',
})
export class HDIService {
  private _sessionStorage = inject(SESSION_STORAGE);

  public device;
  public weight = signal<number>(null);
  public unit = signal<string>(null);
  public isConnect = signal<string>(this._sessionStorage.getItem('HidDevice'));

  constructor(private _fetchWeight: FindWeightScaleConfigGQL) {}

  async connectHID() {
    if (!('hid' in navigator)) {
      console.error('WebHID is not supported in this browser.');
      return;
    }

    try {
      const filters = [
        // FairBanks
        {
          vendorId: 0x0b67,
          productId: 0x555e,
        },
      ];
      [this.device] = await (navigator as any).hid.requestDevice({ filters });
      await this.device.open();
      this.device.addEventListener('inputreport', (event: any) => {
        const { data, device, reportId } = event;
        const buffArray = new Uint8Array(data.buffer);
        if (buffArray[0] === 4) {
          this.weight.set(buffArray[3] / 100 + (buffArray[4] * 256) / 100);
          this.unit.set(buffArray[1] === 12 ? 'lb' : 'kg');
        } else {
          this.weight.set(0);
        }
      });
    } catch (error) {
      console.error('Failed to connect to the HID device:', error);
    }
  }

  checkWeightScaleConfig$() {
    return this._fetchWeight
      .fetch()
      .pipe(map((res) => res.data.findHdiDevice.WeightScale));
  }
}
