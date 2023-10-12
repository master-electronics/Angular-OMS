import { Injectable, computed, signal } from '@angular/core';
import {
  JsonFormControls,
  JsonFormData,
} from 'src/app/shared/ui/input/json-form/json-form.service';

interface FilterUser {
  _id: number;
  Name: string;
}

interface ListOfEvent {
  label: string;
  value: number;
  groupLabel: string;
}

@Injectable()
export class EventLogService {
  // Event type for Event type input selector
  private _listOfEvent = signal<ListOfEvent[]>(null);
  listOfEvent = computed(() => this._listOfEvent());
  setListOfEvent(list: ListOfEvent[]) {
    this._listOfEvent.set(list);
  }

  // filter User for User selector
  private _filterUser = signal<FilterUser[]>(null);
  filterUser = computed(() => this._filterUser());
  setFilterUser(userList: FilterUser[]) {
    this._filterUser.set(userList);
  }
  insertUserToFilterUser(user: FilterUser) {
    this._filterUser.update((list) => [user, ...list]);
  }

  setFilter(list: number[]): JsonFormData {
    const tmp = new Array<JsonFormControls>();
    list.map((id) => {
      if (id < 100) {
        tmp.push({
          name: 'InventoryTrackingNumber',
          label: 'ITN',
          value: '',
          type: 'text',
          required: false,
          validators: {},
        });
        tmp.push({
          name: 'OrderNumber',
          label: 'Order',
          value: '',
          type: 'text',
          required: false,
          validators: {},
        });
        return;
      }
      if (id < 4200) {
        tmp.push({
          name: 'InventoryTrackingNumber',
          label: 'ITN',
          value: '',
          type: 'text',
          required: false,
          validators: {},
        });

        tmp.push({
          name: 'PartNumber',
          label: 'PartNumber',
          value: '',
          type: 'text',
          required: false,
          validators: {},
        });
      }
    });
    const unique = tmp.filter(
      (arr, index, self) => index === self.findIndex((t) => t.name === arr.name)
    );
    return { controls: unique };
  }

  addToControl(input: JsonFormControls, list: JsonFormControls[]) {
    const flag = list.some((control) => {
      control.name === input.name;
    });
    flag ? list : list.push(input);
  }
}
