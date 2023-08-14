import { Component, OnInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { catchError, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';

import { Datacolumn } from './data-maintenance.server';

import {
  FetchDataTableListGQL,
  FetchDataColumnListGQL,
  FetchTableDataGQL,
  InsertTableDataGQL,
  UpdateTableDataGQL,
  DeleteTableDataGQL,
} from 'src/app/graphql/dataMaintenance.graphql-gen';
import { DataColumn } from 'src/app/graphql/utilityTools.graphql-gen';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'data-maintenance',
  templateUrl: './data-maintenance.component.html',
  styleUrls: ['./data-maintenance.component.css'],
  standalone: true,
  imports: [
    NzGridModule,
    NzSelectModule,
    FormsModule,
    NgIf,
    NzTableModule,
    NgFor,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzInputModule,
    NzWaveModule,
    NzPopconfirmModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzAlertModule,
  ],
})
export class DataMaintenance implements OnInit {
  tableOptionsList: { label: string; value: string }[];
  selectedTable: string;
  columns: Datacolumn[];
  columnSelect: string;
  tablePrimaryKey: string;
  tableData;
  tableDataDisplay;
  editCache: { [key: string]: { edit: boolean; data } } = {};
  addCache: { [key: string]: { data } } = {};
  temp;
  sqlTextTypes = [
    'CHAR',
    'VARCHAR',
    'BINARY',
    'VARBINARY',
    'TINYBLOB',
    'TINYTEXT',
    'TEXT',
    'BLOB',
    'MEDIUMTEXT',
    'MEDIUMBLOB',
    'LONGTEXT',
    'LONGBLOB',
    'ENUM',
    'SET',
  ];
  sqlNumberTypes = [
    'BIT',
    'TINYINT',
    'SMALLINT',
    'MEDIUMINT',
    'INT',
    'INTEGER',
    'BIGINT',
    'FLOAT',
    'DOUBLE',
    'DECIMAL',
    'DEC',
  ];
  sqlDateTypes = ['DATE', 'DATETIME', 'DATETIME2', 'TIMESTAMP', 'TIME', 'YEAR'];
  filters: { filterColumn: string; filterValue: string }[];
  message: string;
  alertType = 'success';

  private tableListSubscription = new Subscription();
  private columnListSubscription = new Subscription();
  private tableDataSubscription = new Subscription();
  private insertDataSubscription = new Subscription();
  private updateDataSubscription = new Subscription();
  private deleteDataSubscription = new Subscription();
  private fetchLastPKSubscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private titleService: Title,
    private _fetchTableList: FetchDataTableListGQL,
    private _fetchColumnList: FetchDataColumnListGQL,
    private _fetchTableData: FetchTableDataGQL,
    private _insertTableData: InsertTableDataGQL,
    private _updateTableData: UpdateTableDataGQL,
    private _deleteTableData: DeleteTableDataGQL
  ) {
    this.commonService.changeNavbar('Data Maintenance');
    this.titleService.setTitle('Data Maintenance');
  }

  ngOnInit(): void {
    this.tableOptionsList = [];
    this.selectedTable = '';
    this.columns = [];
    this.filters = [];
    this.getTableList();
    this.message = '';
  }

  onDataTableChange(): void {
    this.message = '';

    if (this.selectedTable) {
      this.getColumnList();
    } else {
      this.tablePrimaryKey = null;
      this.columns = null;
      this.temp = null;
      this.tableData = null;
      this.tableDataDisplay = null;
      this.editCache = null;
    }
  }

  getTableList(): void {
    const tables: { label: string; value: string }[] = [];

    this.tableListSubscription.add(
      this._fetchTableList
        .fetch({}, { fetchPolicy: 'network-only' })
        .subscribe({
          next: (res) => {
            res.data.fetchDataTableList.map((table) => {
              tables.push({ label: table.TABLE_NAME, value: table.TABLE_NAME });
            });

            this.tableOptionsList = tables;
          },
          error: (error) => {
            this.alertType = 'error';
            this.message = error;
          },
        })
    );
  }

  getColumnList(): void {
    this.tablePrimaryKey = '';
    this.columns = [];
    this.columnListSubscription.add(
      this._fetchColumnList
        .fetch(
          { tableName: this.selectedTable },
          { fetchPolicy: 'network-only' }
        )
        .subscribe({
          next: (res) => {
            res.data.fetchDataColumnList.map((col) => {
              const column: Datacolumn = {
                Name: col.COLUMN_NAME,
                Nullable: col.IS_NULLABLE == 'YES' ? true : false,
                DataType: this.parseDataType(col.DATA_TYPE),
                MaxLength: col.CHARACTER_MAXIMUM_LENGTH,
                PrimaryKey: col.IS_PRIMARY_KEY == 'Y' ? true : false,
                SearchVisible: false,
                SearchActive: false,
                sortFn: (a: [], b: []): number =>
                  (a[col.COLUMN_NAME]
                    ? a[col.COLUMN_NAME].toString()
                    : ''
                  ).localeCompare(
                    b[col.COLUMN_NAME] ? b[col.COLUMN_NAME].toString() : ''
                  ),
              };

              if (column.PrimaryKey) {
                this.tablePrimaryKey = column.Name;
              }

              this.columns.push(column);
            });
            this.columnSelect = this.getColumnSelectStr();
            this.getTableData();
          },
          error: (error) => {
            this.alertType = 'error';
            this.message = error;
          },
        })
    );
  }

  parseDataType(dataType: string): string {
    if (dataType.toUpperCase() == 'BIT') {
      return 'boolean';
    }

    if (this.sqlTextTypes.includes(dataType.toUpperCase())) {
      return 'string';
    }

    if (this.sqlNumberTypes.includes(dataType.toUpperCase())) {
      return 'number';
    }

    if (this.sqlDateTypes.includes(dataType.toUpperCase())) {
      return 'date';
    }

    return 'string';
  }

  getColumnSelectStr(): string {
    let str = '';
    let sep = '';
    let plus = '';

    this.columns.map((col) => {
      str +=
        sep +
        plus +
        `'${col.Name}` +
        `~~~'+convert(varchar,isnull(${col.Name},''))`;
      sep = `+'|||'`;
      plus = '+';
    });

    str += ' as Results';

    return str;
  }

  getTableData(): void {
    this.temp = [];
    this.tableData = [];
    this.tableDataDisplay = [];
    this.editCache = {};
    this.addCache = {};
    const row2 = [];
    const dataObj = {};

    this.columns.map((col) => {
      dataObj[col.Name] =
        col.DataType == 'boolean'
          ? false
          : col.DataType == 'number'
          ? null
          : '';
    });

    this.addCache['0'] = {
      data: dataObj,
    };

    this.tableDataSubscription.add(
      this._fetchTableData
        .fetch(
          { columnList: this.columnSelect, tableName: this.selectedTable },
          { fetchPolicy: 'network-only' }
        )
        .subscribe({
          next: (res) => {
            res.data.fetchTableData.map((dataRow) => {
              row2.push(dataRow.Results);
            });

            this.parseData(row2);
          },
          error: (error) => {
            this.alertType = 'error';
            this.message = error;
          },
        })
    );
  }

  parseData(data): void {
    const rows = [];
    const trows = [];

    data.map((r) => {
      const trow = {};
      const tableRow = {};
      const cols = r.split('|||');

      cols.map((data) => {
        const tparts = data.split('~~~');
        const colParts = data.split('~~~');
        let value = colParts[1];

        const col = this.columns.find((item) => item.Name == colParts[0]);

        if (col) {
          if (col.DataType == 'boolean') {
            if (value == 1) {
              value = true;
            } else {
              value = false;
            }
          }
        }

        const tcol = this.columns.find((item) => item.Name == tparts[0]);

        if (tcol) {
          if (tcol.DataType == 'boolean') {
            if (tparts[1] == 1) {
              tparts[1] = true;
            } else {
              tparts[1] = false;
            }
          }
        }

        trow[tparts[0]] = tparts[1];
        tableRow[colParts[0]] = value;
      });

      rows.push(tableRow);
      trows.push(trow);
    });

    this.temp = trows;
    this.tableData = rows;

    this.tableDataDisplay = this.tableData;

    this.temp.map((row) => {
      this.editCache[row[this.tablePrimaryKey].toString()] = {
        edit: false,
        data: row,
      };
    });
  }

  startEdit(id: number): void {
    this.alertType = '';
    this.message = '';

    this.editCache[id].edit = true;
  }

  deleteRow(id: number): void {
    this.alertType = '';
    this.message = '';

    const queryStr = `delete from ${this.selectedTable} where ${this.tablePrimaryKey} = ${id}`;

    this.deleteDataSubscription.add(
      this._deleteTableData
        .mutate({
          deleteQuery: queryStr,
        })
        .subscribe({
          next: (res) => {
            const rows = [];

            this.tableDataDisplay.map((row) => {
              if (row[this.tablePrimaryKey] != id) {
                rows.push(row);
              }
            });

            this.tableDataDisplay = rows;
            this.tableData = this.tableDataDisplay;

            this.alertType = 'success';
            this.message = 'Row Deleted';
          },
          error: (error) => {
            this.alertType = 'error';
            this.message = error;
          },
        })
    );
  }

  saveEdit(id: number): void {
    this.alertType = '';
    this.message = '';

    let queryStr = 'update ' + this.selectedTable + ' set ';
    let comma = '';

    const cols = this.editCache[id].data;

    for (let [key, value] of Object.entries(cols)) {
      if (key != this.tablePrimaryKey) {
        const column = this.columns.find((item) => item.Name == key);

        if (column) {
          if (column.DataType == 'date') {
            value = value
              ? this.dateTimeFormat(new Date(value.toString()))
              : null;
          }
        }

        queryStr += comma + key + ` = '${value}'`;
        comma = ', ';
      }
    }

    queryStr += ` where ${this.tablePrimaryKey} = ${id}`;

    this.updateDataSubscription.add(
      this._updateTableData
        .mutate({
          updateQuery: queryStr,
        })
        .subscribe({
          next: (res) => {
            this.editCache[id].edit = false;
            this.alertType = 'success';
            this.message = 'Row Saved';
          },
          error: (error) => {
            this.alertType = 'error';
            this.message = error;
          },
        })
    );

    const savedRow = this.tableDataDisplay.find(
      (item) => item[this.tablePrimaryKey] === id
    );

    if (savedRow) {
      this.columns.map((col) => {
        savedRow[col.Name] = this.editCache[id].data[col.Name];
      });
    }
  }

  cancelEdit(id: number): void {
    this.alertType = '';
    this.message = '';

    const index = this.tableData.findIndex(
      (item) => item[this.tablePrimaryKey] === id
    );

    this.editCache[id] = {
      data: { ...this.tableData[index] },
      edit: false,
    };
  }

  dateTimeFormat(date: Date): string {
    let month = '' + (date.getMonth() + 1);
    const day = '' + date.getDate();
    const year = '' + date.getFullYear();
    let hours = '' + date.getHours();
    let minutes = '' + date.getMinutes();
    let seconds = '' + date.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;

    const output =
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds;

    return output;
  }

  addData(): void {
    this.alertType = '';
    this.message = '';

    let valid = false;
    const cols = this.addCache['0'].data;
    const keys = Object.keys(cols);

    let queryStr = `insert into ${this.selectedTable} `;
    let comma = '';
    let columnsStr = '(';
    let valueStr = '(';

    for (let [key, value] of Object.entries(cols)) {
      if (key != this.tablePrimaryKey) {
        const column = this.columns.find((item) => item.Name == key);

        let quote = '';

        if (column) {
          if (column.DataType == 'date') {
            value = value
              ? this.dateTimeFormat(new Date(value.toString()))
              : null;
          }
        }

        if (value) {
          valid = true;
          quote = `'`;
        }

        if (value == false) {
          quote = `'`;
        }

        columnsStr += `${comma} ${key}`;
        valueStr += `${comma} ${quote}${value}${quote}`;
        comma = ', ';
      }
    }

    columnsStr += ')';
    valueStr += ')';

    queryStr += `${columnsStr} values ${valueStr}`;
    queryStr += ' select @@IDENTITY as Results';

    if (valid) {
      this.insertDataSubscription.add(
        this._insertTableData
          .mutate({
            insertQuery: queryStr,
          })
          .subscribe({
            next: (res) => {
              const newRow = {};
              const newRow2 = {};

              newRow[this.tablePrimaryKey] =
                res.data.insertTableData[0].Results;
              newRow2[this.tablePrimaryKey] =
                res.data.insertTableData[0].Results;

              for (const [key, value] of Object.entries(cols)) {
                if (key != this.tablePrimaryKey) {
                  newRow[key] = value;
                  newRow2[key] = value;
                }
              }

              const rows1 = [];
              const rows2 = [];

              this.tableDataDisplay.map((row) => {
                rows1.push(row);
                rows2.push(row);
              });

              this.editCache = {};

              rows1.map((row) => {
                this.editCache[row[this.tablePrimaryKey].toString()] = {
                  edit: false,
                  data: row,
                };
              });

              this.editCache[newRow[this.tablePrimaryKey].toString()] = {
                edit: false,
                data: newRow,
              };

              rows2.push(newRow2);

              this.tableData = rows2;
              this.tableDataDisplay = this.tableData;

              this.alertType = 'success';
              this.message = 'Row Added';
            },
            error: (error) => {
              this.alertType = 'error';
              this.message = error;
            },
            complete: () => {
              const dataObj = {};

              this.columns.map((col) => {
                dataObj[col.Name] =
                  col.DataType == 'boolean'
                    ? false
                    : col.DataType == 'number'
                    ? null
                    : '';
              });

              this.addCache['0'] = {
                data: dataObj,
              };
            },
          })
      );
    }
  }

  cancelAdd(): void {
    this.alertType = '';
    this.message = '';

    const dataObj = {};

    this.columns.map((col) => {
      dataObj[col.Name] =
        col.DataType == 'boolean'
          ? false
          : col.DataType == 'number'
          ? null
          : '';
    });

    this.addCache['0'] = {
      data: dataObj,
    };
  }

  setFilter(FilterColumn: Datacolumn, FilterValue: string): void {
    FilterColumn['SearchVisible'] = false;
    FilterColumn['SearchActive'] = true;

    const index = this.filters
      .map((filter) => filter.filterColumn)
      .indexOf(FilterColumn['Name']);

    if (index > -1) {
      this.filters[index] = {
        filterColumn: FilterColumn['Name'],
        filterValue: FilterValue,
      };
    } else {
      this.filters.push({
        filterColumn: FilterColumn['Name'],
        filterValue: FilterValue,
      });
    }

    this.filterResults();
  }

  clearFilter(FilterColumn: Datacolumn): void {
    FilterColumn['SearchVisible'] = false;
    FilterColumn['SearchActive'] = false;

    const index = this.filters
      .map((filter) => filter.filterColumn)
      .indexOf(FilterColumn['Name']);

    if (index > -1) {
      this.filters.splice(index, 1);
    }

    this.filterResults();
  }

  filterResults(): void {
    this.tableDataDisplay = this.tableData;

    this.filters.map((filter) => {
      this.tableDataDisplay = this.tableDataDisplay.filter(
        (item) =>
          item[filter.filterColumn]
            .toString()
            .toUpperCase()
            .indexOf(filter.filterValue.toUpperCase()) !== -1
      );
    });
  }

  ngOnDestroy(): void {
    this.tableListSubscription.unsubscribe();
    this.columnListSubscription.unsubscribe();
    this.tableDataSubscription.unsubscribe();
    this.insertDataSubscription.unsubscribe();
    this.updateDataSubscription.unsubscribe();
    this.deleteDataSubscription.unsubscribe();
    this.fetchLastPKSubscription.unsubscribe();
  }
}
