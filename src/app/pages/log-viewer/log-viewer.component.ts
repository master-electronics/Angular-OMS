import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';
import { catchError, map } from 'rxjs/operators';
import { FetchLocalLogsGQL } from 'src/app/graphql/logger.graphql-gen';

@Component({
  selector: 'log-viewer',
  templateUrl: './log-viewer.component.html',
})
export class LogViewerComponent {
  isLoading = false;
  fetchData$;
  Date: string;

  constructor(
    private commonService: CommonService,
    private fb: UntypedFormBuilder,
    private titleService: Title,
    private fetchLogs: FetchLocalLogsGQL
  ) {
    this.commonService.changeNavbar('Log Viewer');
    this.titleService.setTitle('LogViewer');
  }

  filterForm = this.fb.group({
    errorLevel: ['Error', [Validators.required]],
    timeRange: ['', [Validators.required]],
  });

  resetForm(): void {
    this.filterForm.reset({
      errorLevel: '',
      timeRange: '',
    });
  }

  onSubmit(): void {
    if (this.filterForm.invalid || this.isLoading) return;
    const selectedDate = this.filterForm.get('timeRange').value;
    this.Date = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    this.isLoading = true;
    this.fetchData$ = this.fetchLogs
      .fetch(
        {
          Date: this.Date,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          this.isLoading = false;
          const result = res.data.findLocalErrorLogs.map((res) => {
            const log = JSON.parse(res);
            return log;
          });
          return result;
        }),
        catchError((error) => {
          this.isLoading = false;
          return error;
        })
      );
  }
}
