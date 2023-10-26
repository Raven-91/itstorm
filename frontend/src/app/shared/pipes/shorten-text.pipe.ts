import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText'
})
export class ShortenTextPipe implements PipeTransform {
  transform(value: string): string {
    let result: string = value;
    if (result && result.length > 220) {
      result = value.slice(0, 220) + '...';
    }
    return result;
  }
}
