import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { map, of, tap } from 'rxjs';
import { FetchEventLogGQL } from 'src/app/graphql/tableView.graphql-gen';
import { TableViewComponent } from 'src/app/shared/ui/table-view.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TableViewComponent,
  ],
  template: `
    <div class="px-1 py-4">
      <table-view [data]="data$ | async"> </table-view>
    </div>
  `,
})
export class EventLogComponent implements OnInit {
  public data$;
  public inputForm: FormGroup = new FormGroup({
    printerName: new FormControl(null, [Validators.required]),
  });
  constructor(private router: Router, private _log: FetchEventLogGQL) {}

  ngOnInit(): void {
    this.onSubmit();
  }

  onSubmit(): void {
    this.data$ = this._log.fetch().pipe(
      tap(() => {
        //
      }),
      map((res) => {
        const keySet = new Set<string>();
        const result = res.data.findEventLogs.map((res) => {
          const log = JSON.parse(res.Log);
          Object.entries(log).map((key) => keySet.add(key[0]));
          return {
            Name: res.UserName,
            Type: res.Module + ' | ' + res.Event,
            Time: res.CreateTime,
            Log: JSON.parse(res.Log),
          };
        });
        const keyArray = [...keySet];
        return result.map((row) => {
          const log = row.Log;
          keyArray.map((key) => {
            row[key] = log[key];
          });
          delete row.Log;
          return row;
        });
      })
    );
  }

  onBack(): void {
    this.router.navigateByUrl('/home');
  }
}
