import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'partFilter',
})
export class PartFilterPipe implements PipeTransform {
  transform(value: any, args: string) {
    if (!value) return null;
    if (!args) return value;
    args = args.toLowerCase();
    return value.filter((item) => {
      const target = item.ProductCode + item.PartNumber;
      if (target.toLowerCase().includes(args)) {
        return item;
      }
    });
  }
}
