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

interface ListOfFilter {
  label: string;
  value: string;
}

@Injectable()
export class EventLogService {
  // Event type for Event type input selector
  private _listOfEvent = signal<ListOfEvent[]>(null);
  listOfEvent = computed(() => this._listOfEvent());
  setListOfEvent(list: ListOfEvent[]) {
    this._listOfEvent.set(list);
  }

  // Event type for Event type input selector
  private _listOfFilter = signal<ListOfFilter[]>(null);
  listOfFilter = computed(() => this._listOfFilter());
  setListOfFilter(list: ListOfFilter[]) {
    this._listOfFilter.set(list);
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

  setFilterList(list: string[]): JsonFormData {
    const filter = new Array<JsonFormControls>();
    list.map((title) => {
      filter.push({
        name: title,
        label: title,
        value: '',
        type: 'text',
        required: false,
        validators: {},
      });
    });
    return { controls: filter };
  }
}
