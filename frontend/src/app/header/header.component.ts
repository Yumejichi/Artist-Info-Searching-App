import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsLoggedIn = false;
  fullName: string = "";
  profileImageUrl: string = "";
  // favorites: any = [];
  private authStateSubscription: Subscription | null = null;
  private userDataSubscription: Subscription | null = null;

  constructor(private authenticationService: AuthenticationService, private notificationService: NotificationService) {

  }

  ngOnInit() {
    this.authStateSubscription = this.authenticationService.getAuthState().subscribe(isLoggedIn => {
      this.userIsLoggedIn = isLoggedIn;
    });
    // this.userIsLoggedIn = this.authenticationService.getIsLoggedIn();
  
    this.userDataSubscription = this.authenticationService.getUserDataObservable().subscribe(userInfo => {
      this.fullName = userInfo.fullName;
      this.profileImageUrl = userInfo.profileImageUrl;
      // this.favorites = userInfo.favorites;
    });
  }

  onLogout() {
    this.authenticationService.logout();

    this.notificationService.addNotification("success", "Logged out");
  }

  onDeleteAccount() {
    this.authenticationService.deleteAccount();

    this.notificationService.addNotification("danger", "Account deleted");
  }

  ngOnDestroy(): void {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
      
  }


}
