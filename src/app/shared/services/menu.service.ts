import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { FetchMenuListGQL } from 'src/app/graphql/menu.graphql-gen';

interface MenuItem {
  _id: number;
  ParentID: number;
  Route: string;
  Front?: string;
  Highlight?: string;
  End?: string;
  CoverSrc?: string;
  ADGroupProtected?: boolean;
  Order?: number;
  Level?: number;
  Expandable?: boolean;
  Expanded?: boolean;
  Children?: MenuItem[];
  Groups?: string[];
  Authorized?: boolean;
  Title?: string;
}
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  tempItems: MenuItem[];
  public menuItems: MenuItem[];
  public rootMenuItems;
  public menusLoaded: Promise<boolean>;

  private menuListSubscription = new Subscription();

  constructor(private _fetchMenuList: FetchMenuListGQL) {}

  public getRootItems(): void {
    this.rootMenuItems = this.menuItems.filter((item) => item.ParentID == null);

    this.menusLoaded = Promise.resolve(true);
  }

  public getMenu(PageName: string): void {
    this.tempItems = [];
    this.menuItems = [];

    this.menuListSubscription.add(
      this._fetchMenuList
        .fetch({
          pageName: PageName,
        })
        .subscribe({
          next: (res) => {
            res.data.fetchMenuList.map((menu) => {
              let authorized = false;

              const authToken = JSON.parse(sessionStorage.getItem('userToken'));
              const userGroups = authToken.userGroups.toString().split(',');
              const menuGroups = menu.Groups ? menu.Groups.split(',') : null;

              userGroups.map((group) => {
                if (menuGroups) {
                  if (menuGroups.includes(group)) {
                    authorized = true;
                  }
                }
              });

              this.tempItems.push({
                _id: menu._id,
                ParentID: menu.ParentID,
                Route: menu.Route,
                Front: menu.Front ? menu.Front : '',
                Highlight: menu.Highlight ? menu.Highlight : '',
                End: menu.End ? menu.End : '',
                CoverSrc: menu.CoverSrc,
                ADGroupProtected: menu.ADGroupProtected,
                Order: menu.Order,
                Level: menu.Level,
                Expandable: false,
                Expanded: false,
                Children: [],
                Groups: menu.Groups ? menu.Groups.split(',') : [],
                Authorized: authorized,
                Title: menu.Title,
              });
            });
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            this.parseMenu();
            this.getRootItems();
          },
        })
    );
  }

  private parseMenu(): void {
    const rootNodes = this.tempItems.filter((item) => item.ParentID == null);

    rootNodes.map((node) => {
      const children = this.tempItems.filter(
        (item) => item.ParentID == node._id
      );

      children.map((child) => {
        this.parseChildren(child);
      });

      this.menuItems.push({
        _id: node._id,
        ParentID: node.ParentID,
        Route: node.Route,
        Front: node.Front,
        Highlight: node.Highlight,
        End: node.End,
        CoverSrc: node.CoverSrc,
        ADGroupProtected: node.ADGroupProtected,
        Order: node.Order,
        Level: node.Level,
        Expandable: false,
        Expanded: false,
        Children: children,
        Title: node.Title,
      });
    });
  }

  private parseChildren(node) {
    const parentNode = this.tempItems.find((item) => item._id == node.ParentID);
    const children = this.tempItems.filter((item) => item.ParentID == node._id);

    children.map((child) => {
      this.parseChildren(child);
    });

    if (children.length > 0) {
      if (parentNode) {
        parentNode.Expandable = true;
        node.Children = children;
      }
    }
  }

  ngOnDestroy(): void {
    this.menuListSubscription.unsubscribe();
  }
}
