import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { NgForm } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  backEndError:string | null = null;

  constructor(public authenticationService: AuthenticationService, private router: Router) {}
  onLogin(form: NgForm) {
    this.authenticationService.login(form.value.emailAddress, form.value.password)
    .pipe(catchError((error) => {
        
        if (error.status === 0) {
          console.error('An error occurred:', error.error);
        } else {
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }
        console.log(error.error.message);
        this.backEndError = error.error.message;
        return throwError(() => error);
      })) 
      .subscribe(response => {
        // console.log(response);
        this.authenticationService.checkAuthentication();
        this.router.navigate(['/']);

      })
  }
}
