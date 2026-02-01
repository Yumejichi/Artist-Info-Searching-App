import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  title = 'Search';

  constructor(private authService: AuthenticationService, public notificationService: NotificationService, private router: Router) { }


  ngOnInit(): void {
    
    this.authService.checkAuthentication();  // check if user is loggedin

    // localStorage.removeItem('userFavorites');
  
  }
}
