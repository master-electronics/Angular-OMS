import {
    Component,
    OnInit
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { FetchUserListGQL,
        FindUsersGQL,
        FetchZoneListGQL,
        FetchUsersForZoneGQL,
        FetchZonesForUserGQL,
        InsertUserZoneGQL,
        DeleteUserZoneGQL, } from 'src/app/graphql/pulling.graphql-gen';
import { Subscription } from 'rxjs';
import {CdkDragDrop, CdkDragRelease, CdkDragStart, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { subscribe } from 'graphql';
import { DeletePrinterGQL } from 'src/app/graphql/printerMaintenance.graphql-gen';
import { List } from 'postcss/lib/list';

@Component({
    selector: 'puller-assignment',
    templateUrl: './puller-assignment.component.html',
    styleUrls: ['./puller-assignment.component.css']
})
export class PullerAssignmentComponent implements OnInit {
    userTableData = [];
    zoneTableData = [];
    zoneTableDataHold = [];
    zoneFilters = [];
    zoneTypeFilters = [];
    zoneEquipmentFilters = [];
    selectedUserID: number;
    selectedUserEquipment: string;
    selectedUserZones = new Set<number>();
    nameSearchTxt: string;
    dcOptions: { label: string; value: string }[];
    selectedDistributionCenter: string;
    expandSet = new Set<number>();
    typeOptions: { label: string; value: string }[];
    priorityOptions: { label: string; value: string }[];
    numPullsFilterOptions = [];
    zonePullsStartedFilterOptions = [];
    zonePriorityPullsFilterOptions = [];
    zonePullsACustFilterOptions = [];
    marks;
    numPullsDisabled: boolean;
    filters: { filterColumn: string; filterValue: string }[];
    zoneFilterFn: (list: string[], item: []) => boolean;
    testTxt: string;
    zoneNumPullsFilterVisible: boolean;
    zonePullsStartedFilterVisible: boolean;
    zonePriorityPullsFilterVisible: boolean;
    zonePullsACustFilterVisible: boolean;

    todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

    done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

    private fetchUserListSubscription = new Subscription();
    private findUsersSubscription = new Subscription();
    private fetchZoneListSubscription = new Subscription();
    private fetchZoneUsersSubscription = new Subscription();
    private fetchUserZonesSubscription = new Subscription();
    private insertUserZoneSubscription = new Subscription();
    private deleteUserZoneSubscription = new Subscription();

    constructor(
        private _fetchUserList: FetchUserListGQL,
        private _findUsers: FindUsersGQL,
        private _fetchZoneList: FetchZoneListGQL,
        private _fetchZoneUsers: FetchUsersForZoneGQL,
        private _fetchUserZones: FetchZonesForUserGQL,
        private _insertUserZone: InsertUserZoneGQL,
        private _deleteUserZone: DeleteUserZoneGQL,
    ){}

    onExpandChange(id: number, checked: boolean): void {
        if (checked) {
            this.expandSet.add(id);
        } else {
            this.expandSet.delete(id);
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        alert(event.currentIndex);
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
          );
        }
      }

    test2(): void {
        this.expandSet.clear();
    }

    test(event: CdkDragDrop<string[]>): void {
        if (this.zoneTableData.length > 0) {
            if (event.currentIndex < this.zoneTableData.length) {
                if (!this.selectedUserZones.has(this.zoneTableData[event.currentIndex]._id)) {
                    this.insertUserZone(this.zoneTableData[event.currentIndex]._id);
                    this.loadZones();
                    this.selectUser(this.selectedUserID, this.selectedUserEquipment);
                }
            }
        }
    }

    changeNameSearch(e): void {
        this.loadUsers();
    }

    ngOnInit(): void {
        this.zoneFilterFn = function(list: string[], item: []): boolean {
            if (list.some(zone => item["zone"].indexOf(zone) !== -1)) {
                return true;
            }

            return false;
        }

        this.filters = [];
        this.numPullsDisabled = true;
        this.numPullsFilterOptions = [0,100];
        this.marks = {
            0: '0',
            100: '100'
        };
        this.dcOptions = [
            { label: "PH", value: "PH" },
            { label: "WI", value: "WI" }
        ];

        this.typeOptions = [
            { label: "ALL", value: "ALL" },
            { label: "STANDARD", value: "STANDARD" },
            { label: "DRYPACK", value: "DRYPACK" },
            { label: "REEL", value: "REEL" }
        ];

        this.priorityOptions = [
            { label: "ALL", value: "ALL" },
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" }
        ];

        this.loadUsers();
    }

    zoneNumberFilter(list: string[], item: []): boolean {
        for (let i=0; i<list.length; i++) {
            if (item["zone"] == list[i]) {
                return true;
            }
        }
        return false;
    }

    zoneTypeFilter(list: string[], item: []): boolean {
        for (let i=0; i<list.length; i++) {
            if (item["type"] == list[i]) {
                return true;
            }
        }
        return false;
    }

    zoneNumPullsFilter(): void {
        this.zoneNumPullsFilterVisible = false;
        this.zoneTableData = this.zoneTableDataHold;
        const data = [];
        this.zoneTableData.map((zone) => {
            if (zone["pullCount"] >= this.numPullsFilterOptions[0] && zone["pullCount"] <= this.numPullsFilterOptions[1]) {
                data.push(zone);
            }
        });

        this.zoneTableData = data;
    }

    zoneNumPullsFilterReset(): void {
        this.zoneNumPullsFilterVisible = false;
        this.zoneTableData = this.zoneTableDataHold;
        this.numPullsFilterOptions = [0,100];
    }

    zonePullsStartedFilter(): void {
        this.zonePullsStartedFilterVisible = false;
        this.zoneTableData = this.zoneTableDataHold;

        const data = [];

        this.zoneTableData.map((zone) => {
            if (zone["pullsStarted"] >= this.zonePullsStartedFilterOptions[0] && zone["pullsStarted"] <= this.zonePullsStartedFilterOptions[1]) {
                data.push(zone);
            }
        });

        this.zoneTableData = data;
    }

    zonePullsStartedFilterReset(): void {
        this.zonePullsStartedFilterVisible = false;
        this.zoneTableData = this.zoneTableDataHold;
        this.zonePullsStartedFilterOptions = [0,100];
    }

    setFilter(FilterColumn: [], FilterValue: string): void {
        FilterColumn["searchVisible"] = false;
        FilterColumn["searchActive"] = true;

        const index = this.filters.map(filter => filter.filterColumn).indexOf(FilterColumn["dataName"]);
    }

    selectUser(UserID: number, Equipment: string): void {
        this.zoneTableData = this.zoneTableDataHold;
        this.selectedUserID = UserID;
        this.selectedUserEquipment = Equipment;

        const userEquipmentArray = (Equipment)?Equipment.split(','):[];
        const zoneList = [];
        const zoneFilters = [];
        const zoneTypeFilters = [];
        const zoneEquipmentFilters = [];

        for (let z=0; z<this.zoneTableData.length; z++) {
            let display = true;

            if (this.zoneTableData[z].equipment) {
                const zoneEquipmentArray = this.zoneTableData[z].equipment.split(',');

                for (let e = 0; e < zoneEquipmentArray.length; e++) {
                    if (!userEquipmentArray.includes(zoneEquipmentArray[e])) {
                        display = false;
                    }
                }
            }


            if (display) {
                zoneList.push(this.zoneTableData[z]);

                zoneFilters.push(
                    {
                        text: this.zoneTableData[z].zone,
                        value: this.zoneTableData[z].zone
                    }
                );

                zoneTypeFilters.push(
                    {
                        text: this.zoneTableData[z].type,
                        value: this.zoneTableData[z].type
                    }
                );

                if (this.zoneTableData[z].equipment) {
                    const equipment = this.zoneTableData[z].equipment.split(',');

                    for (let i = 0; i < equipment.length; i++) {
                        if (!zoneEquipmentFilters.includes(equipment[i])) {
                            zoneEquipmentFilters.push(equipment[i]);
                        };
                    }
                }

            }
        }

        this.zoneTableData = zoneList;
        this.zoneFilters = zoneFilters;
        this.zoneTypeFilters = zoneTypeFilters;

        for (let e=0; e<zoneEquipmentFilters.length; e++) {
            this.zoneEquipmentFilters.push(
                {
                    text: zoneEquipmentFilters[e],
                    value: zoneEquipmentFilters[e]
                }
            );
        }

        for(let i=0; i<this.userTableData.length; i++) {

            if (this.userTableData[i].userID == UserID) {
                this.userTableData[i].class = "selected";
            } else {
                this.userTableData[i].class = "";
            }
        }

        this.fetchUserZones();
    }

    loadUsers(): void {
        this.userTableData = [];

        if (!this.nameSearchTxt) {
            this.fetchUserList();
            return;
        }

        if (this.nameSearchTxt.length > 2) {
            this.findUsers();
        } else {
            this.fetchUserList();
        }
    }

    loadZones(): void {
        this.zoneTableData = [];
        //this.zoneFilters = [];

        this.fetchZoneListSubscription.add(
            this._fetchZoneList.fetch(
                {
                    distributionCenter: this.selectedDistributionCenter
                },
                {
                    fetchPolicy: 'network-only'
                }
            ).subscribe((res) => {
                const zoneData = [];
                const zoneFilters = [];
                const zoneTypeFilters = [];
                const zoneEquipmentFilters = [];

                zoneFilters.push(
                    {
                        text: 'All',
                        value: 'All'
                    }
                );

                zoneTypeFilters.push(
                    {
                        text: 'All',
                        value: 'All'
                    }
                );

                zoneEquipmentFilters.push(
                    {
                        text: 'All',
                        value: 'All'
                    }
                );

                res.data.fetchZoneList.map((zone) => {
                    const userData = [];
                    this.fetchZoneUsersSubscription.add(
                        this._fetchZoneUsers.fetch(
                            {
                                zoneID: zone._id
                            },
                            {
                                fetchPolicy: 'network-only'
                            }
                        ).subscribe((res) => {  
                            res.data.fetchUsersForZone.map((user) => {
                                userData.push(
                                    {
                                        UserID: user._id,
                                        Name: user.Name,
                                        ZoneID: zone._id
                                    }
                                );
                            })
                        })
                    );
                    zoneData.push(
                        {
                            _id: zone._id,
                            zone: zone.Zone,
                            type: zone.Type,
                            pullCount: zone.PullCount,
                            pullsStarted: zone.PullsStarted,
                            priorityPulls: zone.PriorityPulls,
                            custAPulls: zone.CustAPulls,
                            equipment: zone.Equipment,
                            users: userData,
                            expanded: false
                        }
                    );

                    zoneFilters.push(
                        {
                            text: zone.Zone,
                            value: zone.Zone
                        }
                    );

                    if (zone.Equipment) {
                        const equipment = zone.Equipment.split(',');

                        for (let i = 0; i < equipment.length; i++) {
                            const equip = zoneEquipmentFilters.find((obj) => {
                                return obj.text === equipment[i];
                                
                            });

                            if (!equip) {
                                zoneEquipmentFilters.push(
                                    {
                                        text: equipment[i],
                                        value: equipment[i]
                                    }
                                );
                            }
                        }
                    }

                    const type = zoneTypeFilters.find((obj) => {
                        return obj.text === zone.Type;
                    });

                    if (!type) {
                        zoneTypeFilters.push(
                            {
                                text: zone.Type,
                                value: zone.Type
                            }
                        );
                    }

                });

                this.zoneTableData = zoneData;
                this.zoneTableDataHold = this.zoneTableData;
                this.zoneFilters = zoneFilters;
                this.zoneTypeFilters = zoneTypeFilters;
                this.zoneEquipmentFilters = zoneEquipmentFilters;
            })
        );

    }

    findUsers(): void {
        this.findUsersSubscription.add(
            this._findUsers.fetch(
                {
                    name: this.nameSearchTxt
                },
                {
                    fetchPolicy: 'network-only'
                }
            ).subscribe((res) => {
                const userData = [];

                res.data.findUsers.map((user) => {
                    userData.push(
                        {
                            userID: user._id,
                            userName: user.Name,
                            zoneCount: user.ZoneCount,
                            equipment: user.Equipment,
                            level: user.PullerLevel,
                            class: "",
                        }
                    );
                })

                this.userTableData = userData;
            })
        );
    }

    fetchUserList(): void {
        this.fetchUserListSubscription.add(
            this._fetchUserList.fetch(
                {}, { fetchPolicy: 'network-only' }
            ).subscribe((res) => {
                const userData = [];

                res.data.fetchUserList.map((user) => {
                    userData.push(
                        {
                            userID: user._id,
                            userName: user.Name,
                            zoneCount: user.ZoneCount,
                            equipment: user.Equipment,
                            level: user.PullerLevel,
                            class: "",
                        }
                    );
                })

                this.userTableData = userData;
            })
        );
    }

    fetchUserZones(): void {
        this.fetchUserZonesSubscription.add(
            this._fetchUserZones.fetch(
                {
                    userID: this.selectedUserID
                },
                { fetchPolicy: 'network-only' }
            ).subscribe((res) => {
                const zoneData = new Set<number>();

                res.data.fetchZonesForUser.map((zone) => {
                    zoneData.add(zone._id);
                });

                this.selectedUserZones = zoneData;
            })
        );
    }

    insertUserZone(ZoneID: number): void {
        this.insertUserZoneSubscription.add(
            this._insertUserZone.mutate(
                {
                    userID: this.selectedUserID,
                    zoneID: ZoneID
                }
            ).subscribe()
        );
    }

    deleteUserZone(UserID: number, ZoneID: number): void {
        this.deleteUserZoneSubscription.add(
            this._deleteUserZone.mutate(
                {
                    userID: UserID,
                    zoneID: ZoneID
                }
            ).subscribe(() => {
                this.loadZones();
            })
        );
    }

    ngOnDestroy(): void {
        this.fetchUserListSubscription.unsubscribe();
        this.findUsersSubscription.unsubscribe();
        this.fetchZoneListSubscription.unsubscribe();
        this.fetchZoneUsersSubscription.unsubscribe();
        this.fetchUserZonesSubscription.unsubscribe();
        this.insertUserZoneSubscription.unsubscribe();
        this.deleteUserZoneSubscription.unsubscribe();
    }
}