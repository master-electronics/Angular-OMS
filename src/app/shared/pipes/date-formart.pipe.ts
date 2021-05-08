import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
})
export class dateFormatPipe implements PipeTransform {
  transform(dateValue: string | string): string {
    try {
      let returnDate =
        dateValue.slice(0, 4) +
        '-' +
        dateValue.slice(4, 6) +
        '-' +
        dateValue.slice(6, 8) +
        ' ' +
        dateValue.slice(8, 10) +
        ':';
      const min = Math.ceil(0.6 * parseInt(dateValue.slice(11, 14), 10));
      returnDate = returnDate + String(min).padStart(2, '0');
      return returnDate;
    } catch (error) {
      return dateValue;
    }
  }
}
