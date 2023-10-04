import { Injectable, computed, signal } from '@angular/core';

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
}
