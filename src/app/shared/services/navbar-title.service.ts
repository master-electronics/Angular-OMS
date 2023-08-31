import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavbarTitleService {
  //state
  private _title = signal<string>('Home');

  //selectors
  title = computed(() => this._title());

  // reducers
  update(title: string) {
    this._title.set(title);
  }
}
