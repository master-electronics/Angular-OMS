import { computed, inject, Injectable, signal } from '@angular/core';
import { SESSION_STORAGE } from '../utils/storage';

export interface UserToken {
  userName: string;
  userGroups: string[];
  idToken: string;
}

export interface UserInfoStorage extends UserToken {
  userId?: number;
  DistributionCenter?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorageUserInfoService {
  sessionStorage = inject(SESSION_STORAGE);
  private _userInfo = signal<UserInfoStorage>(this.loadUserInfo());
  public userInfo = computed(() => this._userInfo());

  loadUserInfo() {
    const userInfoString = this.sessionStorage.getItem('userInfo');
    return userInfoString
      ? (JSON.parse(userInfoString) as UserInfoStorage)
      : null;
  }

  saveUserInfo(userInfo: UserInfoStorage) {
    this.sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    this._userInfo.set(userInfo);
  }

  get userName() {
    return this._userInfo() ? this.userInfo().userName : null;
  }

  get userGroups() {
    return this._userInfo() ? this.userInfo().userGroups : null;
  }

  get idToken() {
    return this._userInfo() ? this.userInfo().idToken : null;
  }

  get userId() {
    return this._userInfo() ? this.userInfo().userId : null;
  }

  get distributionCenter() {
    return this._userInfo() ? this.userInfo().DistributionCenter : null;
  }
}
