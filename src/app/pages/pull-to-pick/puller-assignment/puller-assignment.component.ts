import {
    Component,
    OnInit, HostListener
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
        DeleteUserZoneGQL,
        FetchProductTypesGQL, } from 'src/app/graphql/pulling.graphql-gen';
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
    zoneTableDataUser = [];
    zoneFilters = [];
    selectedZoneFilters = [];
    zoneTypeFilters = [];
    selectedZoneTypeFilters = [];
    selectedZoneEquipmentFilters = [];
    selectedNumPullsFilters = [];
    zoneEquipmentFilters = [];
    selectedUserID: number;
    draggedUserID: number;
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
    zoneNumberFilterVisible: boolean;
    zoneTypeFilterVisible: boolean;
    zoneNumPullsFilterVisible: boolean;
    zonePullsStartedFilterVisible: boolean;
    zonePriorityPullsFilterVisible: boolean;
    zonePullsACustFilterVisible: boolean;
    zoneEquipmentFilterVisible: boolean;
    testbool = true;
    selectedZoneType;
    selectedZonePriority;
    screenHeight;
    screenWidth;
    dragging: boolean;

    todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

    done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

    private fetchUserListSubscription = new Subscription();
    private findUsersSubscription = new Subscription();
    private fetchZoneListSubscription = new Subscription();
    private fetchZoneUsersSubscription = new Subscription();
    private fetchUserZonesSubscription = new Subscription();
    private insertUserZoneSubscription = new Subscription();
    private deleteUserZoneSubscription = new Subscription();
    private fetchProductTypesSubscription = new Subscription();

    constructor(
        private _fetchUserList: FetchUserListGQL,
        private _findUsers: FindUsersGQL,
        private _fetchZoneList: FetchZoneListGQL,
        private _fetchZoneUsers: FetchUsersForZoneGQL,
        private _fetchUserZones: FetchZonesForUserGQL,
        private _insertUserZone: InsertUserZoneGQL,
        private _deleteUserZone: DeleteUserZoneGQL,
        private _fetchProductTypes: FetchProductTypesGQL,
    ){}

    woot(e) {
        if (!e) {
            this.filterZones();
        }
    }

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
        this.dragging = true;
        this.expandSet.clear();
    }

    test3(t): void {
        t.stopPropagation();
    }

    test(event: CdkDragDrop<string[]>): void {
        this.dragging = false;

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

    testsz(zone): boolean {
        return this.selectedZoneFilters.includes(zone);
    }

    temp(): void {
        alert(this.selectedUserID);
    }

    changeNameSearch(e): void {
        this.loadUsers();
    }

    ngOnInit(): void {
        this.screenHeight = (window.innerHeight-300)+"px";
        this.screenWidth = "700px";
        this.loadProductTypes();
        this.selectedZoneTypeFilters = [];
        this.zoneFilterFn = function(list: string[], item: []): boolean {
            if (list.some(zone => item["zone"].indexOf(zone) !== -1)) {
                return true;
            }

            return false;
        }

        this.filters = [];
        this.numPullsDisabled = true;
        this.numPullsFilterOptions = [0,100];
        this.zonePullsStartedFilterOptions = [0,100];
        this.zonePriorityPullsFilterOptions = [0,100];
        this.zonePullsACustFilterOptions = [0,100];

        this.marks = {
            0: '0',
            100: '100'
        };
        this.dcOptions = [
            { label: "PH", value: "PH" },
            { label: "WI", value: "WI" }
        ];

        // this.typeOptions = [
        //     { label: "ALL", value: "ALL" },
        //     { label: "STANDARD", value: "STANDARD" },
        //     { label: "DRYPACK", value: "DRYPACK" },
        //     { label: "REEL", value: "REEL" }
        // ];

        this.priorityOptions = [
            { label: "ALL", value: "ALL" },
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" }
        ];

        this.loadUsers();
    }
    @HostListener('window:resize', ['$event'])
    onResize(): void {
      this.screenHeight = (window.innerHeight-300)+"px";
    }

    loadProductTypes(): void {
        const productTypes: { label: string; value: string }[] = [];
        productTypes.push( { label: "ALL", value: "ALL" });

        this.fetchProductTypesSubscription.add(
            this._fetchProductTypes.fetch(
                {},{ fetchPolicy: 'network-only' }
            ).subscribe((res) => {
                res.data.fetchProductTypes.map((ProductType) => {
                    productTypes.push(
                        {
                            label: ProductType.ProductType.trim(),
                            value: ProductType.ProductType.trim()
                        }
                    );
                })

                this.typeOptions = productTypes;
            })

        );
        
    }

    userNameSortFn(a: [], b: []): number {
        return a["userName"].localeCompare(b["userName"]);
    }

    userZonesSortFn(a: [], b: []): number {
        if (Number((a["zoneCount"])?a["zoneCount"]:0) < Number((b["zoneCount"])?b["zoneCount"]:0)) {
            return -1
        }

        if (Number((a["zoneCount"])?a["zoneCount"]:0) == Number((b["zoneCount"])?b["zoneCount"]:0)) {
            return 0
        }

        return 1
    }

    userEquipmentSortFn(a: [], b: []): number {
        return ((a["equipment"])?a["equipment"]:"").localeCompare((b["equipment"])?b["equipment"]:"");
    }

    userLevelSortFn(a: [], b: []): number {
        if (Number((a["level"])?a["level"]:0) < Number((b["level"])?b["level"]:0)) {
            return -1
        }

        if (Number((a["level"])?a["level"]:0) == Number((b["level"])?b["level"]:0)) {
            return 0
        }

        return 1
    }

    zoneNumberSortFn(a: [], b: []): number {
        if (Number((a["zone"])?a["zone"]:0) < Number((b["zone"])?b["zone"]:0)) {
            return -1;
        }

        if (Number((a["zone"])?a["zone"]:0) == Number((b["zone"])?b["zone"]:0)) {
            return 0;
        }
        
        return 1;
    }

    zoneTypeSortFn(a: [], b: []): number {
        return ((a["type"])?a["type"]:"").localeCompare((b["type"])?b["type"]:"");
    }

    zoneNumPullsSortFn(a: [], b: []): number {
        if (Number((a["pullCount"])?a["pullCount"]:0) < Number((b["pullCount"])?b["pullCount"]:0)) {
            return -1;
        }

        if (Number((a["pullCount"])?a["pullCount"]:0) == Number((b["pullCount"])?b["pullCount"]:0)) {
            return 0;
        }

        return 1;

    }

    zonePullsStartedSortFn(a: [], b: []): number {
        if (Number((a["pullsStarted"])?a["pullsStarted"]:0) < Number((b["pullsStarted"])?b["pullsStarted"]:0)) {
            return -1;
        }

        if (Number((a["pullsStarted"])?a["pullsStarted"]:0) == Number((b["pullsStarted"])?b["pullsStarted"]:0)) {
            return 0;
        }

        return 1;
    }

    zonePriorityPullsSortFn(a: [], b: []): number {
        if (Number((a["priorityPulls"])?a["priortyPulls"]:0) < Number((b["priorityPulls"])?b["priorityPulls"]:0)) {
            return -1;
        }

        if (Number((a["priorityPulls"])?a["priorityPulls"]:0) == Number((b["priorityPulls"])?b["priorityPulls"]:0)) {
            return 0;
        }

        return 1;
    }

    zoneCustAPullsSortFn(a: [], b: []): number {
        if (Number((a["custAPulls"])?a["custAPulls"]:0) < Number((b["custAPulls"])?b["custAPulls"]:0)) {
            return -1;
        }

        if (Number((a["custAPulls"])?a["custAPulls"]:0) == Number((b["custAPulls"])?b["custAPulls"]:0)) {
            return 0;
        }

        return 1;
    }

    zoneEquipmentSortFn(a: [], b: []): number {
        return ((a["equipment"])?a["equipment"]:"").localeCompare((b["equipment"])?b["equipment"]:"");
    }

    zoneNumberFilterSelected(list: string[]): void {
        this.selectedZoneFilters = list;
    }

    zoneNumberFilter(): void {
        this.zoneNumberFilterVisible = false;

        const data = [];

        this.zoneTableData.map((zone) => {
            if (this.selectedZoneFilters.length > 0) {
                if (this.selectedZoneFilters.includes(zone.zone.toString())) {
                    data.push(zone);
                }
            } else {
                data.push(zone);
            }

        });

        this.zoneTableData = data;
    }

    zoneNumberFilterReset(): void {
        this.zoneNumberFilterVisible = false;
        
        const zoneFilters = [];

        this.zoneFilters.map((filter) => {
            zoneFilters.push(
                {
                    text: filter.text,
                    value: filter.value,
                    checked: false
                }
            );
        });

        this.zoneFilters = zoneFilters;

        this.selectedZoneFilters = [];
        this.filterZones();
    }

    zoneTypeFilterSelected(list: string[]): void {
        this.selectedZoneTypeFilters = list;
    }

    zoneTypeFilter(): void {
        this.zoneTypeFilterVisible = false;

        const data = [];

        this.zoneTableData.map((zone) => {
            if (this.selectedZoneTypeFilters.length > 0) {
                if (this.selectedZoneTypeFilters.includes(zone.type.toString())) {
                    data.push(zone);
                }
            } else {
                data.push(zone);
            }
        });

        this.zoneTableData = data;
    }

    zoneTypeFilterReset(): void {
        this.zoneTypeFilterVisible = false;

        const typeFilters = [];

        this.zoneTypeFilters.map((filter) => {
            typeFilters.push(
                {
                    text: filter.text,
                    value: filter.value,
                    checked: false
                }
            );
        });

        this.zoneTypeFilters = typeFilters;

        this.selectedZoneTypeFilters = [];
        this.filterZones();
    }

    zoneEquipmentFilterSelected(list: string[]): void {
        this.selectedZoneEquipmentFilters = list;
    }

    zoneEquipmentFilter(): void {
        this.zoneEquipmentFilterVisible = false;

        const data = [];

        this.zoneTableData.map((zone) => {
            if (this.selectedZoneEquipmentFilters.length > 0) {
                this.selectedZoneEquipmentFilters.map((equipment) => {
                    if (zone.equipment) {
                        if (zone.equipment.includes(equipment)) {
                            data.push(zone);
                        }
                    }

                });
            } else {
                data.push(zone);
            }
        });

        this.zoneTableData = data;
    }

    zoneEquipmentFilterReset(): void {
        this.zoneEquipmentFilterVisible = false;

        const equipmentFilters = [];

        this.zoneEquipmentFilters.map((filter) => {
            equipmentFilters.push(
                {
                    text: filter.text,
                    value: filter.value,
                    checked: false
                }
            );
        });

        this.zoneEquipmentFilters = equipmentFilters;

        this.selectedZoneEquipmentFilters = [];
        this.filterZones();
    }

    zoneNumPullsFilter(): void {
        this.zoneNumPullsFilterVisible = false;
        //this.zoneTableData = this.zoneTableDataHold;
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
        this.numPullsFilterOptions = [0,100];
        this.filterZones();
    }

    zonePullsStartedFilter(): void {
        this.zonePullsStartedFilterVisible = false;
        //this.zoneTableData = this.zoneTableDataHold;

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
        this.zonePullsStartedFilterOptions = [0,100];
        this.filterZones();
    }

    zonePriorityPullsFilter(): void {
        this.zonePriorityPullsFilterVisible = false;

        const data = [];

        this.zoneTableData.map((zone) => {
            if (zone["priorityPulls"] >= this.zonePriorityPullsFilterOptions[0] && zone["priorityPulls"] <= this.zonePriorityPullsFilterOptions[1]) {
                data.push(zone);
            }
        });

        this.zoneTableData = data;
    }

    zonePriorityPullsFilterReset(): void {
        this.zonePriorityPullsFilterVisible = false;
        this.zonePriorityPullsFilterOptions = [0,100];
        this.filterZones();
    }

    zonePullsACustFilter(): void {
        this.zonePullsACustFilterVisible = false;

        const data = [];

        this.zoneTableData.map((zone) => {
            if (zone["custAPulls"] >= this.zonePullsACustFilterOptions[0] && zone["custAPulls"] <= this.zonePullsACustFilterOptions[1]) {
                data.push(zone);
            }
        });

        this.zoneTableData = data;
    }

    zonePullsACustFilterReset(): void {
        this.zonePullsACustFilterVisible = false;
        this.zonePullsACustFilterOptions = [0,100];
        this.filterZones();
    }

    closeFilterDropdown(e): void {
        if (!e) {
            this.filterZones();
        }
    }

    filterTypeChange(): void {
        this.filterZones();
    }

    filterPriorityChange(): void {
        this.filterZones();
    }

    filterZones(): void {
        this.zoneTableData = (this.zoneTableDataUser.length > 0) ? this.zoneTableDataUser : this.zoneTableDataHold;

        this.zoneNumberFilter();
        this.zoneTypeFilter();
        this.zoneNumPullsFilter();
        this.zonePullsStartedFilter();
        this.zonePriorityPullsFilter();
        this.zonePullsACustFilter();
        this.zoneEquipmentFilter();
        this.setFilterOptions();
        this.filterZonesByType();
        this.filterZonesByPriority();
    }

    setFilterOptions(): void {
        const zoneFilters = [];
        const zoneTypeFilters = [];
        const zoneEquipmentFilters = [];

        this.zoneTableData.map((zone) => {
            zoneFilters.push(
                {
                    text: zone.zone,
                    value: zone.zone,
                    checked: this.selectedZoneFilters.includes(zone.zone.toString())
                }
            );

            const type = zoneTypeFilters.find((obj) => {
                return obj.text === zone.type;
            });

            if (!type) {
                zoneTypeFilters.push(
                    {
                        text: zone.type,
                        value: zone.type,
                        checked: this.selectedZoneTypeFilters.includes(zone.type.toString())
                    }
                );
            }


            if (zone.equipment) {
                const equipment = zone.equipment.split(',');

                for (let i = 0; i < equipment.length; i++) {
                    if (!zoneEquipmentFilters.includes(equipment[i])) {
                        zoneEquipmentFilters.push(
                            {
                                text: equipment[i],
                                value: equipment[i],
                                checked: this.selectedZoneEquipmentFilters.includes(equipment[i].toString())
                            }
                        );
                    };
                }
            }
        })
        

        this.zoneFilters = zoneFilters;
        this.zoneTypeFilters = zoneTypeFilters;
        this.zoneEquipmentFilters = [];

        zoneEquipmentFilters.map((equipment) => {
            this.zoneEquipmentFilters.push (
                {
                    text: equipment.text,
                    value: equipment.value,
                    checked: equipment.checked
                }
            );
        })

    }

    selectUser(UserID: number, Equipment: string): void {
        this.zoneTableData = this.zoneTableDataHold;
        this.zoneTableDataUser = [];

        //if (this.selectedUserID == UserID && !this.dragging) {
            //this.selectedUserID = null;
        //} else {
            this.selectedUserID = UserID;
            this.selectedUserEquipment = Equipment;

            const userEquipmentArray = (Equipment) ? Equipment.split(',') : [];
            const zoneList = [];

            for (let z = 0; z < this.zoneTableData.length; z++) {
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
                }
            }

            this.zoneTableData = zoneList;
            this.zoneTableDataUser = this.zoneTableData;
        //}
        

        for(let i=0; i<this.userTableData.length; i++) {

            if (this.userTableData[i].userID == this.selectedUserID) {
                this.userTableData[i].class = "selected";
            } else {
                this.userTableData[i].class = "";
            }
        }

        this.fetchUserZones();
        this.filterZones();
    }

    selectUserDrag(UserID: number): void {
        this.draggedUserID = UserID;
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
                            type: zone.Type.trim(),
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
                            value: zone.Zone,
                            checked: this.selectedZoneFilters.includes(zone.Zone)
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
                                        value: equipment[i],
                                        checked: this.selectedZoneEquipmentFilters.includes(equipment[i])
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
                                value: zone.Type,
                                checked: this.selectedZoneTypeFilters.includes(zone.Type)
                            }
                        );
                    }

                });

                this.zoneTableData = zoneData;
                this.zoneTableDataHold = this.zoneTableData;
                this.zoneFilters = zoneFilters;
                this.zoneTypeFilters = zoneTypeFilters;
                this.zoneEquipmentFilters = zoneEquipmentFilters;

                this.filterZonesByType();
            })
        );

    }

    filterZonesByType(): void {
        const data = [];

        this.zoneTableData.map((zone) => {
            if (this.selectedZoneType == "ALL" || !this.selectedZoneType) {
                data.push(zone);
            } else {
                if (zone.type == this.selectedZoneType) {
                    data.push(zone);
                }
            }

        });

        this.zoneTableData = data;
    }

    filterZonesByPriority(): void {
        const data = []

        this.zoneTableData.map((zone) => {
            if (this.selectedZonePriority == "ALL" || !this.selectedZonePriority) {
                data.push(zone);
            } else {
                if (this.selectedZonePriority == "Yes") {
                    if (zone.priorityPulls > 0) {
                        data.push(zone);
                    }
                } else if (this.selectedZonePriority == "No") {
                    if (zone.priorityPulls <= 0) {
                        data.push(zone);
                    }
                }
            }
        });

        this.zoneTableData = data;
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
        this.fetchProductTypesSubscription.unsubscribe();
    }
}