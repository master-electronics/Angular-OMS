import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { asapScheduler } from 'rxjs';
import Keyboard from 'simple-keyboard';

@Component({
  standalone: true,
  selector: 'simple-keyboard',
  template: ` <div class="simple-keyboard"></div> `,
  styles: [
    `
      .simple-keyboard {
        font-size: 3vw;
        position: absolute;
        bottom: 15px;
        width: 95%;
        left: 2.5%;
        text-align: center;
      }
    `,
  ],
})
export class SimpleKeyboardComponent implements OnChanges {
  keyboard: Keyboard;
  @Input() inputString;
  @Input() layout = 'default';
  @Output() outputString: EventEmitter<string> = new EventEmitter();

  ngOnChanges(): void {
    this.keyboard?.setInput(this.inputString);
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

      if (this.layout === 'number') {
        this.handleNumbers();
      }
    });
  }

  onChange = (input: string) => {
    this.outputString.emit(input);
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
