import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShortcutInput } from 'ng-keyboard-shortcuts';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  // title
  private rxjsTitleSubject = new BehaviorSubject<string>('Master Electronics');
  public rxjsTitle: Observable<string> = this.rxjsTitleSubject.asObservable();
  public changeTitle(title: string): void {
    this.rxjsTitleSubject.next(title);
  }
  // shutcuts
  private shortcutsSubject = new BehaviorSubject<ShortcutInput[]>([]);
  public shortcuts: Observable<ShortcutInput[]> =
    this.shortcutsSubject.asObservable();
  public changeshortcuts(newShortcuts: ShortcutInput[]): void {
    this.shortcutsSubject.next(newShortcuts);
  }

  constructor(public platform: Platform) {
    //
  }
  isMobile(): boolean {
    return this.platform.IOS || this.platform.ANDROID;
  }
}
