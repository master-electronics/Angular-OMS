import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Column } from './itn-lifecycle.server';

@Component({
    selector: 'column-selector',
    template: `
        <input type="checkbox" (change)="allCheckboxOnChange($event)" 
            name="allCheckbox"
            [checked]="allColumnsSelected"><label for="allCheckbox" style="position: relative; top: 2px;"> All</label>
        <div id="columnsList">
            <div nz-row style="display: inline-block; width: 50%; vertical-align: top;">
                <div *ngFor="let column of columns">          
                    <div nz-col *ngIf="column.position % 2 !== 0">
                        <input type="checkbox" 
                            (change)="checkboxOnChange($event)" 
                            name="{{ column.name }}"
                            [checked]="selectedColumns.includes(column.name)">
                        <label style="position: relative; top: 2px;" for="{{ column.name }}"> {{ column.title }}</label>
                    </div>
                </div>
            </div>
            <div nz-row style="display: inline-block; width: 50%; vertical-align: top;">
                <div *ngFor="let column of columns">
                    <div nz-col *ngIf="column.position % 2 === 0">
                        <input type="checkbox" 
                            (change)="checkboxOnChange($event)" 
                            name="{{ column.name }}"
                            [checked]="selectedColumns.includes(column.name)">
                        <label style="position: relative; top: 2px;" for="{{ column.name }}"> {{ column.title }}</label>
                    </div>
                </div>                         
            </div>
        </div>
    `,
    styleUrls: ['./column-selector.component.css']
})
export class ColumnSelectorComponent {
    @Output() checked: EventEmitter<any> = new EventEmitter();
    @Output() unchecked: EventEmitter<any> = new EventEmitter();
    @Output() allChecked: EventEmitter<any> = new EventEmitter();
    @Output() allUnchecked: EventEmitter<any> = new EventEmitter();
    @Input('columns') columns: Column[];
    @Input('selectedColumns') selectedColumns: string[];
    @Input("allColumns") allColumnsSelected: boolean;

    //handle column checkbox change
    checkboxOnChange(e) {
        if (e.target.checked) {
            //checkbox selected emit checked to tabs-view
            this.checked.emit(e);
            if (this.selectedColumns.length == this.columns.length) {
                this.allColumnsSelected = true;
            } else {
                this.allColumnsSelected = false;
            }
        } else {
            //checkbox unselected emil unchecked to tabs-view
            this.unchecked.emit(e);
            if (this.selectedColumns.length == this.columns.length) {
                this.allColumnsSelected = true;
            } else {
                this.allColumnsSelected = false;
            }
        }
    }

    //handle all checkbox change
    allCheckboxOnChange(e) {
        let index;
        const inputs = document.getElementById('columnsList').getElementsByTagName('input');

        //loop through each column checkbox, select or unselect, emit allCheck or allUnchecked to tabs-view
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