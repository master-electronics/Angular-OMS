import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
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
      <ng-container>
        <table-view
          [listOfColumn]="listOfColumn"
          [data]="data$ | async"
        ></table-view>
      </ng-container>
    </div>
  `,
})
export class EventLogComponent implements OnInit {
  public data$;
  listOfColumn = [
    {
      title: 'Name',
      compare: (a: string, b: string) => a.localeCompare(b),
      priority: false,
    },
    {
      title: 'Type',
      compare: (a: string, b: string) => a.localeCompare(b),
      priority: false,
    },
    {
      title: 'Time',
      compare: (a: string, b: string) => a.localeCompare(b),
      priority: false,
    },
    {
      title: 'Log',
    },
  ];
  public inputForm: FormGroup = new FormGroup({
    printerName: new FormControl(null, [Validators.required]),
  });
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _log: FetchEventLogGQL
  ) {}

  ngOnInit(): void {
    this.data$ = of(true);
    this.onSubmit();
  }

  onSubmit(): void {
    this.data$ = this._log.fetch().pipe(
      tap((res) => {
        //
      }),
      map((res) => {
        return res.data.findEventLogs.map((res) => {
          return {
            Name: res.UserName,
            Type: res.Module + ' | ' + res.Event,
            Time: res.CreateTime,
            Log: res.Log,
          };
        });
      })
    );
  }

  onBack(): void {
    this.router.navigateByUrl('/home');
  }
}
