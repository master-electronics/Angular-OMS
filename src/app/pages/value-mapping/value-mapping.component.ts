import { Component, OnInit } from "@angular/core";
import { 
    FetchValueMapViewGQL, 
    InsertValueMapGQL,   
    UpdateValueMapGQL,
    DeleteValueMapGQL,
    FetchEntityListGQL,
} from "src/app/graphql/valueMapping.graphql-gen";
import { catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface tableData {
    ID: number;
    SourceData: string;
    TargetLocation: string;
    SourceValue: string;
    TargetValue: string;
}

@Component({
    selector: 'value-mapping',
    templateUrl: './value-mapping.component.html',
})
export class ValueMapping implements OnInit {

    constructor(
        private fetchValueMapView: FetchValueMapViewGQL,
        private fetchEntityList: FetchEntityListGQL,
        private insertValueMap: InsertValueMapGQL,
        private updateValueMap: UpdateValueMapGQL,
        private deleteValueMap: DeleteValueMapGQL,
    ) {
    }
    editCache: { [key: string]: { edit: boolean; data: tableData } } = {};
    listOfColumn = [
        {
            title: 'Source Location',
            compare: (a: tableData, b: tableData): number =>
                a.SourceData.localeCompare(b.SourceData),
        },
        {
            title: 'Target Location',
            compare: (a: tableData, b: tableData): number =>
                a.TargetLocation.localeCompare(b.TargetLocation),
        },
        {
            title: 'Source Value',
            compare: (a: tableData, b: tableData): number =>
                a.SourceValue.localeCompare(b.SourceValue),
        },
        {
            title: 'Target Value',
            compare: (a: tableData, b: tableData): number =>
                a.TargetValue.localeCompare(b.TargetValue),
        }
    ];

    isLoading = false;
    fetchTable$;
    private valueMapViewSubscription = new Subscription();
    private sourceEntityListSubscription = new Subscription();
    private targetEntityListSubscription = new Subscription();
    private insertValueMapSubscription = new Subscription();
    private updateValueMapSubscription = new Subscription();
    private deleteValueMapSubscription = new Subscription();
    viewData: tableData[];
    message: string;
    alertType = 'error';
    sourceOptions: { label: string; value: string; }[];
    targetOptions: { label: string; value: string; }[];
    newMappingSourceLocation;
    newMappingTargetLocation;
    newMappingSourceValue;
    newMappingTargetValue;

    ngOnInit(): void {
        this.sourceOptions = [];
        this.targetOptions = [];

        this.sourceEntityListSubscription.add(
            this.fetchEntityList
                .fetch(
                    { type: 'S' },
                    { fetchPolicy: 'network-only' }
                )
                .subscribe((res) => {
                    res.data.fetchEntityList.map((item) => {
                        this.sourceOptions.push(
                            {
                                label: item.SystemName+":"+item.TableName+":"+item.ColumnName,
                                value: item.SystemName+":"+item.TableName+":"+item.ColumnName
                            }
                    )
                    })
                },
                (error) => {
                   console.log(error);
                })
        );

        this.targetEntityListSubscription.add(
            this.fetchEntityList
                .fetch( 
                    { type: 'T' },
                    { fetchPolicy: 'network-only' }
                )
                .subscribe((res) => {
                    res.data.fetchEntityList.map((item) => {
                        this.targetOptions.push(
                            {
                                label: item.SystemName+":"+item.TableName+":"+item.ColumnName,
                                value: item.SystemName+":"+item.TableName+":"+item.ColumnName
                            }
                        )
                    })

                },
                (error) => {
                    console.log(error);
                })
        );

        this.loadView();

    }

    loadView(): void {
        this.viewData = [];
        this.isLoading = true;

        this.valueMapViewSubscription.add(
            this.fetchValueMapView.fetch(
                {},{ fetchPolicy: 'network-only' }
            ).subscribe((res) => {
                for (let z=0; z<res.data.fetchValueMapView.length;z++) {
                    const tableData: tableData[] = res.data.fetchValueMapView.map(
                        (element) => {
                            this.editCache[element._id.toString()] = {
                                edit: false,
                                data: {
                                    ID: element._id,
                                    SourceData: element.SourceSystemName+":"+element.SourceTableName+":"+element.SourceColumnName,
                                    TargetLocation: element.TargetSystemName+":"+element.TargetTableName+":"+element.TargetColumnName,
                                    SourceValue: element.SourceValue,
                                    TargetValue: element.TargetValue
                                }
                            }

                            return {
                                ID: element._id,
                                SourceData: element.SourceSystemName+":"+element.SourceTableName+":"+element.SourceColumnName,
                                TargetLocation: element.TargetSystemName+":"+element.TargetTableName+":"+element.TargetColumnName,
                                SourceValue: element.SourceValue,
                                TargetValue: element.TargetValue
                            }
                        }
                    );

                    this.viewData = tableData;
                }
            },
                catchError((error) => {
                    this.isLoading = false;
                    return error;
                })
            )
        )

    }

    startEdit(id: number): void {
        this.message = "";
        this.editCache[id].edit = true;
    }

    saveEdit(id: number): void {
        this.message = "";
        const sourceParts: string[] = this.editCache[id].data.SourceData.split(':');
        const SourceSystem = sourceParts[0];
        const SourceTable = sourceParts[1];
        const SourceColumn = sourceParts[2];

        const targetParts: string[] = this.editCache[id].data.TargetLocation.split(':');
        const TargetSystem = targetParts[0];
        const TargetTable = targetParts[1];
        const TargetColumn = targetParts[2];

        this.updateValueMapSubscription.add(
            this.updateValueMap.mutate(
                {   
                    _id: Number(id),
                    sourceSystemName: SourceSystem,
                    sourceTableName: SourceTable,
                    sourceColumnName: SourceColumn,
                    targetSystemName: TargetSystem,
                    targetTableName: TargetTable,
                    targetColumnName: TargetColumn,
                    sourceValue: this.editCache[id].data.SourceValue,
                    targetValue: this.editCache[id].data.TargetValue
                }
            ).subscribe(() => {
                const index = this.viewData.findIndex(item => item.ID === id);
                this.viewData[index].SourceData = this.editCache[id].data.SourceData;
                this.viewData[index].TargetLocation = this.editCache[id].data.TargetLocation;
                this.viewData[index].SourceValue = this.editCache[id].data.SourceValue;
                this.viewData[index].TargetValue = this.editCache[id].data.TargetValue;
                this.editCache[id].edit = false;
            },
            (error) => {
                console.log(error);
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

    deleteRow(id: number): void {
        this.message = "";
        this.deleteValueMapSubscription.add(
            this.deleteValueMap.mutate(
                {
                    _id: Number(id)
                }
            ).subscribe(() => {
                this.loadView();
            },
            (error) => {
                console.log(error);
            })
        );

    }
   
    addValueMap(): void {
        this.message = "";

        if ((this.newMappingSourceLocation) &&
            (this.newMappingTargetLocation) &&
            (this.newMappingSourceValue && /\S/.test(this.newMappingSourceValue)) && 
            (this.newMappingTargetValue && /\S/.test(this.newMappingTargetValue))) {
                const sourceParts: string[] = this.newMappingSourceLocation.split(':');
                const SourceSystem = sourceParts[0];
                const SourceTable = sourceParts[1];
                const SourceColumn = sourceParts[2];
        
                const targetParts: string[] = this.newMappingTargetLocation.split(':');
                const TargetSystem = targetParts[0];
                const TargetTable = targetParts[1];
                const TargetColumn = targetParts[2];
        
                this.insertValueMapSubscription.add(
                    this.insertValueMap.mutate(
                        {   
                            sourceSystemName: SourceSystem,
                            sourceTableName: SourceTable,
                            sourceColumnName: SourceColumn,
                            targetSystemName: TargetSystem,
                            targetTableName: TargetTable,
                            targetColumnName: TargetColumn,
                            sourceValue: this.newMappingSourceValue,
                            targetValue: this.newMappingTargetValue
                        }
                    ).subscribe(() => {
                        this.loadView();
                        this.newMappingSourceLocation = "";
                        this.newMappingTargetLocation = "";
                        this.newMappingSourceValue = "";
                        this.newMappingTargetValue = "";
                    },
                    (error) => {
                        console.log(error);
                    })
                );
        } else {
            this.message = "All fields are required";
        }
    }

    cancelAdd(): void {
        this.message = "";
        this.newMappingSourceLocation = "";
        this.newMappingTargetLocation = "";
        this.newMappingSourceValue = "";
        this.newMappingTargetValue = "";
    }

    ngOnDestroy(): void {
        this.valueMapViewSubscription.unsubscribe();
        this.insertValueMapSubscription.unsubscribe();
        this.updateValueMapSubscription.unsubscribe();
        this.deleteValueMapSubscription.unsubscribe();
        this.sourceEntityListSubscription.unsubscribe();
        this.targetEntityListSubscription.unsubscribe();
    }
}