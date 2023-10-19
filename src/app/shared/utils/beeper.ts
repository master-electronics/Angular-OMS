export class BeepBeep {
  context = new AudioContext();

  beep(vol: number, freq: number): void {
    this.dit(vol, freq, 0);
    this.dit(vol, freq, 0.2);
    this.dit(vol, freq, 0.4);

    this.dah(vol, freq, 0.9);
    this.dah(vol, freq, 1.3);
    this.dah(vol, freq, 1.7);

    this.dit(vol, freq, 2.2);
    this.dit(vol, freq, 2.4);
    this.dit(vol, freq, 2.6);
  }

  dit(vol: number, freq: number, start: number): void {
    const a = this.context.createOscillator();
    const b = this.context.createGain();

    a.connect(b);
    a.frequency.value = freq;
    a.type = 'sine';
    b.connect(this.context.destination);
    b.gain.value = vol * 0.01;

    a.start(this.context.currentTime + start);
    a.stop(this.context.currentTime + (start + 0.1));
  }

  dah(vol: number, freq: number, start: number): void {
    const a = this.context.createOscillator();
    const b = this.context.createGain();

    a.connect(b);
    a.frequency.value = freq;
    a.type = 'sine';
    b.connect(this.context.destination);
    b.gain.value = vol * 0.01;

    a.start(this.context.currentTime + start);
    a.stop(this.context.currentTime + (start + 0.2));
  }
}
