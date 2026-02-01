import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeago',
  pure: false 
})
export class TimeagoPipe implements PipeTransform {

  transform(favTime: Date | string): string {
    if(!favTime) {
      return"";
    }
    const rtf = new Intl.RelativeTimeFormat('en');
    const currentTime = new Date().getTime();
    const input = new Date(favTime).getTime();

    const seconds = Math.floor((currentTime - input)/1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);




    if (seconds <= 60) {
      return rtf.format(-seconds, 'second');
    } else if (minutes < 60) {
      return rtf.format(-minutes, 'minute');
    } else if (hours < 24) {
      return rtf.format(-hours, 'hour');
    } else {
      return rtf.format(-days, 'day');
    }
  }
}
