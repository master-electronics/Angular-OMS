import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { APIService } from '../../shared/service/API.service';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { AgGridAngular } from '@ag-grid-community/angular';

@Component({
  selector: 'app-pickup-inquiry',
  templateUrl: './pickup-inquiry.component.html',
  styleUrls: ['./pickup-inquiry.component.css'],
})
export class PickupInquiryComponent implements OnInit {
  readonly M1PICKRT = {
    M1PICKRT: [
      {
        key: 'PH',
        endKey: 'PH',
        keyNumber: '0',
        requireChild: '1',
        sortBy: 'TimeStamp',
        page: -1,
        maxRow: -1,
        desc: 1,
        fields:
          'OrderNumber,NOSINumber,OrderLineNumber,ProductCode,PartNumber,DemandQuantity,BinLocation,Status,PulledQuantity,InternalTrackingNumber',
        M3FIX: [
          {
            key: 'M1PICKRT.LocationCode$+M1PICKRT.OrderNumber$',
            endKey: 'M1PICKRT.LocationCode$+M1PICKRT.OrderNumber$',
            recordCount: '1',
            requireChild: '1',
            fields: 'ControlNumber,ShipViaCode',
            SHPCDE: [
              {
                key: 'M3FIX.ShipViaCode$',
                endKey: 'M3FIX.ShipViaCode$',
                recordCount: '1',
                fields: 'PriorityPinkPaper,ShippingMethod',
              },
            ],
          },
        ],
        M1PICKQU: [
          {
            key: 'M1PICKRT.OrderNumber$+M1PICKRT.NOSINumber$',
            endKey: 'M1PICKRT.OrderNumber$+M1PICKRT.NOSINumber$',
            recordCount: '1',
            keynumber: '2',
            fields: 'OrderNumber,UserOrStatus',
          },
        ],
        KPISHIPDATE: [
          {
            key: 'M1PICKRT.LocationCode$+M1PICKRT.OrderNumber$+M1PICKRT.NOSINumber$',
            endKey: 'M1PICKRT.LocationCode$+M1PICKRT.OrderNumber$+M1PICKRT.NOSINumber$',
            recordCount: '1',
            keynumber: '0',
            fields: 'OrderNumber,TimeStamp',
          },
        ],
      },
    ],
  };

  public modules = AllCommunityModules;
  columnDefs: any;
  defaultColDef: any;
  rowData: any;
  gridApi: any;
  gridColumnApi: any;

  constructor(private apiservice: APIService) {
    this.columnDefs = [
      {
        field: 'OrderNumber',
        headerCheckboxSelection: this.headerCheckboxSelection,
        minWidth: 150,
        headerName: 'OrderNo.',
      },
      { field: 'NOSINumber', headerName: 'NOSI' },
      { field: 'OrderLineNumber', headerName: 'OrderLine' },
      { field: 'ProductCode' },
      { field: 'PartNumber' },
      {
        field: 'DemandQuantity',
        headerName: 'Demand',
        comparator: this.dateComparator,
      },
      { field: 'Priority', sort: 'desc' },
      { field: 'BinLocation', headerName: 'Bin' },
      { field: 'Zone' },
      {
        field: 'PulledQuantity',
        headerName: 'Pulled',
        comparator: this.dateComparator,
      },
      { field: 'ITN' },
      { field: 'UserOrStatus' },
      {
        field: 'TimeStamp',
        headerName: 'Time',
        valueFormatter: this.timeFormater,
        minWidth: 150,
      },
    ];
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
    };
  }

  dateComparator(str1: string, str2: string) {
    const num1 = parseInt(str1);
    const num2 = parseInt(str2);
    if (isNaN(num1) && isNaN(num2)) return 0;
    if (isNaN(num1)) return -1;
    if (isNaN(num2)) return 1;
    return num1 - num2;
  }
  timeFormater(params: any): string {
    return `${params.value.slice(0, 4)}-${params.value.slice(4, 6)}-${params.value.slice(
      6,
      8
    )} ${params.value.slice(8, 10)}:${Math.floor(parseInt(params.value.slice(11), 10) * 0.6)
      .toString()
      .padStart(2, '0')}`;
  }

  ngOnInit(): void {
    //
  }

  checkboxSelection = function (params: any) {
    return params.columnApi.getRowGroupColumns().length === 0;
  };

  headerCheckboxSelection = function (params: any) {
    return params.columnApi.getRowGroupColumns().length === 0;
  };

  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('pageSize') pageSize: ElementRef;

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataStringPresentation = selectedData
      .map((node) => node.OrderNumber + ' ' + node.Priority)
      .join(', ');

    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }

  onPageSizeChanged(): void {
    const value = this.pageSize.nativeElement.value;
    console.log(Number(value));
    this.agGrid.api.paginationSetPageSize(value);
  }

  sizeToFit(): void {
    this.gridApi.sizeColumnsToFit();
  }

  autoSizeAll(skipHeader: boolean): void {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => allColumnIds.push(column.colId));
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  resetFilter(): void {
    this.gridApi.setFilterModel(null);
    this.gridColumnApi.applyColumnState({ defaultState: { sort: null } });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.gridColumnApi.applyColumnState;
    this.apiservice.onGetPickrt(this.M1PICKRT).subscribe((data) => {
      this.rowData = data;
    });
  }
}
