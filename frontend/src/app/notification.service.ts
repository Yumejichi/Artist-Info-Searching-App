import { Injectable } from '@angular/core';

interface Notification {
  type: string;
  message: string;
  notificationId: number;
}

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  count: number;

  private notifications: Notification[] = [];

  constructor() {
    this.count = 0;
   }

  addNotification(type: string, message: string ) {
    let notification: Notification = 
      {type: type,
        message: message,
        notificationId: ++this.count
      };

    this.notifications.push(notification);

		setTimeout(() => this.removeNotification(notification.notificationId), 3000);

  }

  removeNotification(id: number) {
    let index;
    for (let elem of this.notifications) {
      if (elem.notificationId === id) {
        index = this.notifications.indexOf(elem);
        if (index !== -1) {
          this.notifications.splice(index, 1);
          break;
        }
      }
    }

  }


}
