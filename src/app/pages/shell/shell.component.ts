import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
})
export class ShellComponent implements AfterViewInit {
  shortcuts: ShortcutInput[] = [];
  constructor(private router: Router) {}
  @ViewChild('input') input: ElementRef;
  ngAfterViewInit(): void {
    this.shortcuts.push({
      key: 'alt + h',
      preventDefault: true,
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: (e) => {
        console.log('clicked ', e.key);
        this.router.navigate(['/home']);
      },
    });
  }
}
