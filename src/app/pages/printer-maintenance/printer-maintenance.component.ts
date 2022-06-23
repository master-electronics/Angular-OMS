import { Component, OnInit, HostListener } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { 
    FetchPrinterListGQL,
    InsertPrinterGQL,
    UpdatePrinterGQL,
    DeletePrinterGQL
 } from "src/app/graphql/printerMaintenance.graphql-gen";
import { Subscription } from 'rxjs';
import { CommonService } from "src/app/shared/services/common.service";
import { Title } from "@angular/platform-browser";

interface printerData {
    ID: number;
    Name: string;
    Description: string;
    Orientation: string;
    Active: boolean;
}

@Component({
    selector: 'printer-maintenance',
    templateUrl: './printer-maintenance.component.html',
    styleUrls: ['./printer-maintenance.component.css'],
})
export class PrinterMaintenance implements OnInit {
    isLoading = false;
    editCache: { [key: string]: { edit: boolean; data: printerData } } = {};
    fetchTable$;
    tableData;
    viewData: printerData[];
    viewDataDisplay: printerData[];
    addPrinterName;
    addPrinterDescription;
    addPrinterOrientation;
    message: string;
    alertType = 'error';
    sortNameFn = (a: printerData, b: printerData): number => {
        return ((a.Name)?a.Name:'').localeCompare((b.Name)?b.Name:'');
    };
    sortDescriptionFn = (a: printerData, b: printerData): number => {
        return ((a.Description)?a.Description:'').localeCompare((b.Description)?b.Description:'');
    };
    sortOrientationFn = (a: printerData, b: printerData): number => {
        return ((a.Orientation)?a.Orientation:'').localeCompare((b.Orientation)?b.Orientation:'');
    };
    sortActiveFn = (a: printerData, b: printerData): number => {
        return ((a.Active)?'Y':'N').localeCompare((b.Active)?'Y':'N');
    }
    nameFilterVisible: boolean;
    nameFilterActive: boolean;
    descriptionFilterVisible: boolean;
    descriptionFilterActive: boolean;
    pageNumber: number;
    includeInactive;
    screenWidth: any;
    screenHeight: any;
    
    private printerViewSubscription = new Subscription();
    private insertPrinterSubscription = new Subscription();
    private updatePrinterSubscription = new Subscription();
    private deletePrinterSubscription = new Subscription();

    constructor(
        private commonService: CommonService,
        private titleService: Title,
        private _fetchPrinterList: FetchPrinterListGQL,
        private _insertPrinter: InsertPrinterGQL,
        private _updatePrinter: UpdatePrinterGQL,
        private _deletePrinter: DeletePrinterGQL,
    ) {
        this.commonService.changeNavbar('Printer Maintenance');
        this.titleService.setTitle('Printer Maintenance');
    }

    ngOnInit(): void {
        this.includeInactive = false;
        this.screenWidth = window.innerWidth+"px";
        this.screenHeight = (window.innerHeight-300)+"px";
        this.loadView();
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
      this.screenWidth = window.innerWidth+"px";
      this.screenHeight = (window.innerHeight-300)+"px";
    }

    //scroll data table to the top when changing pages
    scrollToTop(): void {
        const element = document.getElementById("printer-table");
        element.children[0].children[0].children[0].children[0].children[1].scrollTop = 0;

    }

    onIncludeInactiveChange(e): void {
        this.includeInactive = e;
        this.loadView();
    }

    loadView(): void {
        this.isLoading = true;
        this.viewData = [];
        this.viewDataDisplay = [];

        this.printerViewSubscription.add(
            this._fetchPrinterList.fetch(
                { includeInactive: this.includeInactive },{ fetchPolicy: 'network-only' }
            ).subscribe((res) => {
                for (let i=0; i<res.data.fetchPrinterList.length; i++) {
                    const printerData: printerData[] = res.data.fetchPrinterList.map(
                        (printer) => {
                            this.editCache[printer._id.toString()] = {
                                edit: false,
                                data: {
                                    ID: printer._id,
                                    Name: printer.Name,
                                    Description: printer.Description,
                                    Orientation: printer.Orientation,
                                    Active: printer.Active,
                                }
                            }

                            return {
                                ID: printer._id,
                                Name: printer.Name,
                                Description: printer.Description,
                                Orientation: printer.Orientation,
                                Active: printer.Active
                            }
                        }
                    );

                    this.viewData = printerData;
                    this.viewDataDisplay = this.viewData;
                    this.pageNumber = 1;
                    
                };

                this.isLoading = false;
            },
            catchError((error) => {
                this.isLoading = false;
                return error;
            }))
        );
    }

    startEdit(id: number): void {
        this.message = "";
        this.editCache[id].edit = true;
    }

    saveEdit(id: number, nameTB, descriptionTB): void {
        this.message = "";
        let valid = true;

        if (!nameTB.value || !/\S/.test(nameTB.value)) {
            valid = false;
            nameTB.style.border = "solid 1px red";
        } else {
            nameTB.style.border = "";
        }

        if (!descriptionTB.value || !/\S/.test(descriptionTB.value)) {
            valid = false;
            descriptionTB.style.border = "solid 1px red";
        } else {
            descriptionTB.style.border = "";
        }

        if (valid) {
            this.isLoading = true
            this.updatePrinterSubscription.add(
                this._updatePrinter.mutate(
                    {
                        _id: Number(id),
                        name: this.editCache[id].data.Name,
                        description: this.editCache[id].data.Description,
                        orientation: this.editCache[id].data.Orientation,
                        active: this.editCache[id].data.Active
                    }
                ).subscribe(() => {
                    const index = this.viewDataDisplay.findIndex(item => item.ID === id);
                    this.viewDataDisplay[index].Name = this.editCache[id].data.Name;
                    this.viewDataDisplay[index].Description = this.editCache[id].data.Description;
                    this.viewDataDisplay[index].Orientation = this.editCache[id].data.Orientation;
                    this.viewDataDisplay[index].Active = this.editCache[id].data.Active;
                    this.editCache[id].edit = false;
                    this.isLoading = false;
                },
                    (error) => {
                        const errStr = error.toString();
                        if (errStr.includes("Validation error")) {
                            this.message = "There is already a printer with Name " + this.editCache[id].data.Name + ". Duplicates are not allowed.";
                        } else {
                            this.message = "Error adding printer.";
                        }
                        console.log(error);
                        this.isLoading = false;
                    })
            );
        }

    }

    activatePrinter(id: number): void {
        this.message = "";
        this.isLoading = true;
        this.updatePrinterSubscription.add(
            this._updatePrinter.mutate(
                {
                    _id: Number(id),
                    name: this.editCache[id].data.Name,
                    description: this.editCache[id].data.Description,
                    orientation: this.editCache[id].data.Orientation,
                    active: true,
                }
            ).subscribe(() => {
                const index = this.viewDataDisplay.findIndex(item => item.ID === id);
                this.viewDataDisplay[index].Name = this.editCache[id].data.Name;
                this.viewDataDisplay[index].Description = this.editCache[id].data.Description;
                this.viewDataDisplay[index].Orientation = this.editCache[id].data.Orientation;
                this.viewDataDisplay[index].Active = true;
                this.isLoading = false;
            },
            (error) => {
                this.message = "Error activating printer.";
                console.log(error);
                this.isLoading = false;
            })
        );
    }

    cancelEdit(id: number): void {
        this.message = "";
        const index = this.viewData.findIndex(item => item.ID === id);

        this.editCache[id] = {
            data: { ...this.viewData[index] },
            edit: false
        }
    }

    deletePrinter(id: number): void {
        this.isLoading = true;
        this.message = "";
        this.deletePrinterSubscription.add(
            this._deletePrinter.mutate(
                {
                    _id: Number(id)
                }
            ).subscribe(() => {
                this.loadView();
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
                this.isLoading = false;
            })
        );
    }

    addPrinter(nameTB, descriptionTB): void {
        this.message = "";
        let valid = true;

        if (!nameTB.value || !/\S/.test(nameTB.value)) {
            valid = false;
            nameTB.style.border = "solid 1px red";
        } else {
            nameTB.style.border = "";
        }

        if (!descriptionTB.value || !/\S/.test(descriptionTB.value)) {
            valid = false;
            descriptionTB.style.border = "solid 1px red";
        } else {
            descriptionTB.style.border = "";
        }

        if (valid) {
            this.isLoading = true;
            this.insertPrinterSubscription.add(
                this._insertPrinter.mutate(
                    {
                        name: this.addPrinterName,
                        description: this.addPrinterDescription,
                        orientation: this.addPrinterOrientation,
                        active: true,
                    }
                ).subscribe(() => {
                    this.loadView();
                    this.addPrinterName = "";
                    this.addPrinterDescription = "";
                    this.addPrinterOrientation = "";
                    this.isLoading = false;
                },
                (error) => {
                    const errStr = error.toString();
                    if (errStr.includes("Validation error")) {
                        this.message = "There is already a printer with Name " + this.addPrinterName + ". Duplicates are not allowed.";
                    } else {
                        this.message = "Error adding printer.";
                    }
                    console.log(error);
                    this.isLoading = false;
                })
            );
        }
    }



    cancelAdd(nameTB, descriptionTB): void {
        this.message = "";
        this.addPrinterName = "";
        this.addPrinterDescription = "";
        this.addPrinterOrientation = "";
        nameTB.style.border = "";
        descriptionTB.style.border = "";
    }

    setNameFilter(FilterValue: string): void {
        this.nameFilterVisible = false;
        this.nameFilterActive = true;
        this.descriptionFilterVisible = false;
        this.descriptionFilterActive = false;

        this.viewDataDisplay = this.viewData;

        this.viewDataDisplay = this.viewDataDisplay.filter(
            item =>
                item.Name.indexOf(FilterValue) !== -1
        );
    }

    clearNameFilter(): void {
        this.nameFilterVisible = false;
        this.nameFilterActive = false;
        this.descriptionFilterVisible = false;
        this.descriptionFilterActive = false;

        this.viewDataDisplay = this.viewData;
        this.pageNumber = 1;
    }

    setDescriptionFilter(FilterValue: string): void {
        this.nameFilterVisible = false;
        this.nameFilterActive = false;
        this.descriptionFilterVisible = false;
        this.descriptionFilterActive = true;

        this.viewDataDisplay = this.viewData;

        this.viewDataDisplay = this.viewDataDisplay.filter(
            item =>
                item.Description.indexOf(FilterValue) !== -1
        );
    }

    clearDescriptionFilter(): void {
        this.nameFilterVisible = false;
        this.nameFilterActive = false;
        this.descriptionFilterVisible = false;
        this.descriptionFilterActive = false;

        this.viewDataDisplay = this.viewData;
        this.pageNumber = 1;
    }

    ngOnDestroy(): void {
        this.printerViewSubscription.unsubscribe();
        this.updatePrinterSubscription.unsubscribe();
        this.insertPrinterSubscription.unsubscribe();
        this.deletePrinterSubscription.unsubscribe();
    }

    orientationCheck(id, value): void {
        const startOrientation = this.editCache[id].data.Orientation;

        setTimeout(() => {
            if (startOrientation == value) {
                this.editCache[id].data.Orientation = "";
            }
        }, 100);

    }

    addPrinterOrientationCheck(value): void {
        const startOrientation = this.addPrinterOrientation;

        setTimeout(() => {
            if (startOrientation == value) {
                this.addPrinterOrientation = "";
            }
        }, 100);

    }
}