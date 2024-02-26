import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { CommonModule } from '@angular/common';
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

      <button
        *ngIf="status !== 'uploading'"
        (click)="onUpload()"
        class="rounded border-b-4 border-blue-700 bg-blue-500 px-4 py-2 font-bold text-white hover:border-blue-500 hover:bg-blue-400"
      >
        Upload the file
      </button>

      <section [ngSwitch]="status">
        <p *ngSwitchCase="'uploading'">⏳ Uploading...</p>
        <p *ngSwitchCase="'success'">✅ Done!</p>
        <p *ngSwitchCase="'fail'">❌ Error!</p>
        <p *ngSwitchCase="'initial'">😶 Waiting to upload...</p>
        <p *ngSwitchDefault>...</p>
      </section>
    </div>
    <div *ngIf="upload$ | async"></div>
  `,
})
export class SingleFileUploadComponent {
  status: 'initial' | 'uploading' | 'success' | 'fail' = null;
  file: File | null = null;
  upload$;

  constructor(private http: HttpClient) {}

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

      this.upload$ = this.http
        .post(`${environment.apiUrl}/fileUpload/receiving`, formData)
        .pipe(
          map(() => {
            this.status = 'success';
          }),
          catchError((error) => {
            this.status = 'fail';
            return of(error);
          })
        );

      this.status = 'uploading';
    }
  }
}
