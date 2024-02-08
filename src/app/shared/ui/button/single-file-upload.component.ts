import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'single-file-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <h2>Single File Upload</h2>

    <input type="file" (change)="onChange($event)" #fileUpload />

    <div *ngIf="file">
      <section>
        File details:
        <ul>
          <li>Name: {{ file.name }}</li>
          <li>Type: {{ file.type }}</li>
          <li>Size: {{ file.size }} bytes</li>
        </ul>
      </section>

      <button (click)="onUpload()">Upload the file</button>

      <section [ngSwitch]="status">
        <p *ngSwitchCase="'uploading'">⏳ Uploading...</p>
        <p *ngSwitchCase="'success'">✅ Done!</p>
        <p *ngSwitchCase="'fail'">❌ Error!</p>
        <p *ngSwitchDefault>😶 Waiting to upload...</p>
      </section>
    </div>
  `,
})
export class SingleFileUploadComponent {
  status: 'initial' | 'uploading' | 'success' | 'fail' = 'initial';
  file: File | null = null;
  upload$;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.status = 'initial';
      this.file = file;
    }
  }

  onUpload() {
    if (this.file) {
      const formData = new FormData();

      formData.append('file', this.file, this.file.name);

      this.upload$ = this.http.post(
        `${environment.apiUrl}/fileUpload/receiving`,
        formData
      );

      this.status = 'uploading';

      this.upload$
        .pipe(
          takeUntilDestroyed(),
          map(() => {
            this.status = 'success';
          }),
          catchError((error) => {
            this.status = 'fail';
            return of(error);
          })
        )
        .subscribe();
    }
  }
}
