import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  backEndError:string | null = null;

  constructor(private authenticationService: AuthenticationService, private router: Router) {}
  onRegister(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authenticationService.registerNewUser(form.value.fullName, form.value.emailAddress, form.value.password)
    .pipe(
      catchError((error) => {
        
        // if (error.status === 0) {
        //   console.error('An error occurred:', error.error);
        // } else {
        //   console.error(
        //     `Backend returned code ${error.status}, body was: `, error.error);
        // }
        console.log(error.error);
        this.backEndError = error.error;
        return throwError(() => error);
      }))
    .subscribe((response: any) => {
      // console.log(response);
      this.authenticationService.checkAuthentication();
      this.router.navigate(['/']);
    })
  }
}
