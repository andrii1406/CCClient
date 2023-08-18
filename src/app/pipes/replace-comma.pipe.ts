import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceComma'
})
export class ReplaceCommaPipe implements PipeTransform {

  // Replaces comma with dot
  transform(value: string | undefined | null): string {
    if (value === undefined || value === null)
      return ''
    else
      return value.replace(/,/g, '.')
  }

}
