import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';
import { catchError, map } from 'rxjs/operators';
import { FetchLocalLogsGQL } from 'src/app/graphql/logger.graphql-gen';

@Component({
  selector: 'picker-manage',
  templateUrl: './picker-manage.component.html',
})
export class PickerManageComponent {
  isLoading = false;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private titleService: Title,
    private fetchLogs: FetchLocalLogsGQL
  ) {
    this.commonService.changeNavbar('Picker Manage');
    this.titleService.setTitle('Picker Manage');
  }

  filterForm = this.fb.group({
    // errorLevel: ['Error', [Validators.required]],
    // timeRange: ['', [Validators.required]],
  });

  resetForm(): void {
    this.filterForm.reset({
      errorLevel: '',
      timeRange: '',
    });
  }

  onSubmit(): void {
    //
  }
}
