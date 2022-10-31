import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { asapScheduler, filter, map, of } from 'rxjs';
import Keyboard from 'simple-keyboard';
import { ReceivingService } from '../receiving.server';

@Component({
  selector: 'kickout',
  templateUrl: './kickout.component.html',
})
export class KickoutComponent implements OnInit {
  isLoading = false;
  keyboard: Keyboard;

  kickoutOptions = [
    { id: 1, content: 'Short Quantity' },
    { id: 2, content: 'Damaged' },
    { id: 3, content: 'Repackaging' },
    { id: 4, content: 'Wrong Parts' },
    { id: 5, content: 'Verify Quantity' },
    { id: 6, content: 'Mixed Parts' },
    { id: 7, content: 'Part Number Verification' },
    { id: 8, content: 'Kit Set' },
    { id: 0, content: 'Other' },
  ];

  kickoutForm = this._fb.group({
    kickoutReason: ['', Validators.required],
    otherReason: [''],
  });

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: ReceivingService
  ) {}
  ngOnInit(): void {
    this._service.changeTab(2);
  }

  @ViewChild('kickoutReason') InputKickout: ElementRef;
  ngAfterViewInit() {
    asapScheduler.schedule(() => {
      this.keyboard = new Keyboard({
        onChange: (input) => this.onChange(input),
        onKeyPress: (button) => this.onKeyPress(button),
        mergeDisplay: true,
        preventMouseDownDefault: true,
        layoutName: 'default',
        layout: {
          default: [
            'q w e r t y u i o p',
            'a s d f g h j k l',
            '{shift} z x c v b n m {backspace}',
            '{numbers} , {space} . {ent}',
          ],
          shift: [
            'Q W E R T Y U I O P',
            'A S D F G H J K L',
            '{shift} Z X C V B N M {backspace}',
            '{numbers} , {space} . {ent}',
          ],
          numbers: [
            '1 2 3 4 5 6 7 8 9 0',
            '@ # $ _ & - + ( ) /',
            `< > * " ' : ; ! ? {backspace}`,
            '{abc} , {space} . {ent}',
          ],
        },
        display: {
          '{numbers}': '123',
          '{ent}': 'return',
          '{escape}': 'esc ⎋',
          '{tab}': 'tab ⇥',
          '{backspace}': '⌫',
          '{capslock}': 'caps lock ⇪',
          '{shift}': '⇧',
          '{controlleft}': 'ctrl ⌃',
          '{controlright}': 'ctrl ⌃',
          '{altleft}': 'alt ⌥',
          '{altright}': 'alt ⌥',
          '{metaleft}': 'cmd ⌘',
          '{metaright}': 'cmd ⌘',
          '{abc}': 'ABC',
          '{space}': '_________________________________',
        },
      });
    });
  }

  onChange = (input: string) => {
    this.kickoutForm.get('otherReason').setValue(input);
  };

  onKeyPress = (button: string) => {
    if (button === '{shift}' || button === '{lock}') this.handleShift();
    if (button === '{numbers}' || button === '{abc}') this.handleNumbers();
    if (button === '{ent}') this.onSubmit();
  };

  handleShift(): void {
    const currentLayout = this.keyboard.options.layoutName;
    const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

    this.keyboard.setOptions({
      layoutName: shiftToggle,
    });
  }
  handleNumbers(): void {
    const currentLayout = this.keyboard.options.layoutName;
    const numbersToggle = currentLayout !== 'numbers' ? 'numbers' : 'default';

    this.keyboard.setOptions({
      layoutName: numbersToggle,
    });
  }

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  cancal(): void {
    this._router.navigateByUrl('receiving/verify');
  }

  onSubmit(): void {
    this._router.navigateByUrl('receiving');
  }
}
