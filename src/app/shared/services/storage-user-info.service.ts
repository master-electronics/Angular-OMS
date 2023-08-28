import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
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

  loadUserInfo() {
    const userInfoString = this.sessionStorage.getItem('userInfo');
    return of(
      userInfoString
        ? (JSON.parse(userInfoString) as Partial<UserInfoStorage>)
        : null
    );
  }

  saveUserInfo(userInfo: Partial<UserInfoStorage>) {
    this.sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  get userName() {
    const userInfoString = this.sessionStorage.getItem('userInfo');
    const userInfo = userInfoString
      ? (JSON.parse(userInfoString) as Partial<UserInfoStorage>)
      : null;
    return userInfo?.userName ? userInfo.userName : null;
  }

  get userGroups() {
    const userInfoString = this.sessionStorage.getItem('userInfo');
    const userInfo = userInfoString
      ? (JSON.parse(userInfoString) as Partial<UserInfoStorage>)
      : null;
    return userInfo?.userGroups ? userInfo.userGroups : [];
  }

  get idToken() {
    const userInfoString = this.sessionStorage.getItem('userInfo');
    const userInfo = userInfoString
      ? (JSON.parse(userInfoString) as Partial<UserInfoStorage>)
      : null;
    return userInfo?.idToken ? Number(userInfo.idToken) : null;
  }

  get distributionCenter() {
    const userInfoString = this.sessionStorage.getItem('userInfo');
    const userInfo = userInfoString
      ? (JSON.parse(userInfoString) as Partial<UserInfoStorage>)
      : null;
    return userInfo?.DistributionCenter ? userInfo.DistributionCenter : null;
  }
}
