import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { asapScheduler } from 'rxjs';
import Keyboard from 'simple-keyboard';

export enum Layout {
  'default',
  'numeric',
}

@Component({
  standalone: true,
  selector: 'simple-keyboard',
  templateUrl: './simple-keyboard.component.html',
})
export class SimpleKeyboardComponent implements OnChanges {
  keyboard: Keyboard;
  @Input() inputFromParent;
  @Input() layout: Layout | 0;
  @Output() outputFromChild: EventEmitter<string> = new EventEmitter();

  ngOnChanges(): void {
    this.keyboard?.setInput(this.inputFromParent);
  }

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
            'Q W E R T Y U I O P',
            'A S D F G H J K L',
            'Z X C V B N M {backspace}',
            '{numbers} , {space} . {shift}',
          ],
          shift: [
            '1 2 3 4 5 6 7 8 9 0',
            '@ # $ _ & - + ( ) /',
            `< > * " ' : ; ! ? {backspace}`,
            '{numbers} , {space} . {shift}',
          ],
          numbers: ['1 2 3', '4 5 6', '7 8 9', '{abc} 0 {backspace}'],
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

      if (this.layout === Layout.numeric) {
        this.handleNumbers();
      }
    });
  }

  onChange = (input: string) => {
    this.outputFromChild.emit(input);
  };

  onKeyPress = (button: string) => {
    if (button === '{shift}' || button === '{lock}') this.handleShift();
    if (button === '{numbers}' || button === '{abc}') this.handleNumbers();
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
}
