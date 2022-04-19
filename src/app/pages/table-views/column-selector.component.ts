import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Column } from '../../column';

@Component({
    selector: 'column-selector',
    template: `
        <!--
        <button nz-button (click)="showModal()"><i nz-icon nzType="bars" nzTheme="outline" title="Select columns"></i></button>
        <nz-modal [(nzVisible)]="isVisible" nzTitle="Included Columns"
            (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()"
            [nzWidth]="230"
            nzClosable="false"
            [nzCancelText]=null
            (nzAfterClose)="handleClose()">            
            <ng-container *nzModalContent>
-->
                <input type="checkbox" (change)="allCheckboxOnChange($event)" 
                    name="allCheckbox"
                    [checked]="allColumnsSelected"><label for="allCheckbox" style="position: relative; top: 2px;"> All</label>
                <div id="columnsList">
                    <div *ngFor="let column of columns">
                        <input type="checkbox" 
                            (change)="checkboxOnChange($event)" 
                            name="{{ column.name }}"
                            [checked]="selectedColumns.includes(column.name)">
                            <label style="position: relative; top: 2px;" for="{{ column.name }}"> {{ column.title }}</label>
                    </div>
                </div>
                <!--
            </ng-container>
        </nz-modal>
-->
    `,
    styleUrls: ['./column-selector.component.css']
})
export class ColumnSelectorComponent {
    @Output() checked: EventEmitter<any> = new EventEmitter();
    @Output() unchecked: EventEmitter<any> = new EventEmitter();
    @Output() allChecked: EventEmitter<any> = new EventEmitter();
    @Output() allUnchecked: EventEmitter<any> = new EventEmitter();
    @Output() modalClosed: EventEmitter<any> = new EventEmitter();
    @Input('columns') columns: Column[];
    @Input('selectedColumns') selectedColumns: string[];
    @Input("allColumns") allColumnsSelected: boolean;

    isVisible = false;

    constructor() {}

    ngOnInit(): void {
        //alert(JSON.stringify(this.columns));
    }

    showModal(): void {
        this.isVisible = true;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    handleOk(): void {
        this.isVisible = false;
    }

    handleClose(): void {
        this.modalClosed.emit();
    }

    checkboxOnChange(e) {
        if (e.target.checked) {
            this.checked.emit(e);
            if (this.selectedColumns.length == this.columns.length) {
                this.allColumnsSelected = true;
            } else {
                this.allColumnsSelected = false;
            }
        } else {
            this.unchecked.emit(e);
            if (this.selectedColumns.length == this.columns.length) {
                this.allColumnsSelected = true;
            } else {
                this.allColumnsSelected = false;
            }
        }
    }

    allCheckboxOnChange(e) {
        var inputs, index;
        inputs = document.getElementById('columnsList').getElementsByTagName('input');

        for (index = 0; index < inputs.length; ++index) {
            inputs[index].checked = e.target.checked;
            if (e.target.checked) {
                this.allColumnsSelected = true;
                this.allChecked.emit(inputs[index].name);
            } else {
                this.allColumnsSelected = false;
                this.allUnchecked.emit(inputs[index].name);
            }
        }
    }
}