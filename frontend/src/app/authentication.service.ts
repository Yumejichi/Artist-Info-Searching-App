import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import  { AuthenticationData } from './authentication-data-model'
import { FavoriteArtist } from './favorite-artist-model';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isLoggedIn = false;
  private authState = new BehaviorSubject<boolean>(false);
  private tokenExpireTime: Date | null = null;
  private userDataSubj = new Subject<{ fullName: string, profileImageUrl: string, userFavorites: {}}>();
  private userFavoritesSet: Set<string> = new Set<string>();
  private userFavoritesMap: {[key: string]: FavoriteArtist }= {};
  private tokenTimer: any;
  private userFavoritesStored: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  getAuthState() {
    return this.authState.asObservable();
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  getUserDataObservable() {
    return this.userDataSubj.asObservable();
  }
  getTokenExpireTime() {
    return this.tokenExpireTime;
  }

  creatUserFavoriteIdMap(userFavorites: any[]) {
    this.userFavoritesMap = {};
    this.userFavoritesSet.clear(); 
    for (let favorite of userFavorites) {
      this.userFavoritesMap[favorite.artistId] = favorite;
      this.userFavoritesSet.add(favorite.artistId);
    }
  }


  getUserFavoritesStored() {
    return this.userFavoritesStored;
  }

  getUserFavoritSet() {
    return this.userFavoritesSet;
  }

  checkAuthentication() {
    this.http.get<any>('/api/user/me', {
      withCredentials: true
    })
      .subscribe({
        next: (response: any) => {
        // console.log(response.tokenExpiresTime);
        const tokenExpireTime = response.tokenExpiresTime;
      
        if (tokenExpireTime) {
          this.tokenExpireTime = new Date(tokenExpireTime);
          // console.log("token expires at: ", this.tokenExpireTime);
          const logoutTimeDelay = this.tokenExpireTime.getTime() - Date.now();

            if (logoutTimeDelay > 0) {
              
              this.tokenTimer = setTimeout(() => {
                this.logout()}, logoutTimeDelay);
            }
            else {
              this.logout();
              return;
            }

          this.isLoggedIn = true;
          this.authState.next(true);

          const favorites = response.userFavorites;
          // create a map for user favorites
          this.creatUserFavoriteIdMap(response.userFavorites);

          localStorage.setItem('userFavorites', JSON.stringify(this.userFavoritesMap));
          this.userDataSubj.next({
            fullName: response.fullName,
            profileImageUrl: response.profileImageUrl,
            userFavorites: this.userFavoritesMap,
        });

        this.userFavoritesStored = true;
      }
    },
      error: (err) => {
        this.authState.next(false);
        this.isLoggedIn = false;
      }
    })

  }

  registerNewUser(fullName: string, emailAddress: string, password: string): Observable<any[]> {
    const authenticationData: AuthenticationData = {fullName: fullName, emailAddress: emailAddress, password: password};
     return this.http.post<any[]>('/api/user/register', authenticationData, {
      withCredentials: true
    })
  }

  login(emailAddress: string, password: string): Observable<any[]> {
    const loginData = {emailAddress: emailAddress, password: password};
    return this.http.post<any[]>('/api/user/login', loginData, {
      withCredentials: true
    })
  }

  logout() {

  localStorage.removeItem('userFavorites');
    this.http.post('/api/user/logout', {}, { withCredentials: true })
      .subscribe(() => {
      localStorage.clear();
      this.isLoggedIn = false;
      this.authState.next(false);
      this.userDataSubj.next({
        fullName: "",
        profileImageUrl: "",
        userFavorites: {}
      });

      this.userFavoritesSet.clear();
      clearTimeout(this.tokenTimer);
      this.router.navigate(['/search']);
    });
  }

  deleteAccount() {

  localStorage.removeItem('userFavorites');
    this.http.post('/api/user/deleteAccount', {}, {
      withCredentials: true
    })
    .subscribe(() => {
      localStorage.clear();
      this.isLoggedIn = false;
      this.authState.next(false);
      this.userDataSubj.next({
        fullName: "",
        profileImageUrl: "",
        userFavorites: {}
      });
      this.userFavoritesSet.clear();
      clearTimeout(this.tokenTimer);
      this.router.navigate(['/search']);

    })
  }

  getUserFavorites(): Observable<any>  {
    return this.http.get<any>('/api/user/favorites', {
      withCredentials: true
    });
  }

  addFavorite(artistId: string) {
    const data = {
      artistId: artistId
    }
    this.http.post(`/api/artsy/addFavorite/`, data, {
      withCredentials: true
    }).subscribe({
      next: (value) => {
        // console.log("add favo: ", value);
        this.getUserFavorites().subscribe({
          next: (favorites) => {
            // console.log("new favorites:", favorites);
            // upfdate the local storage

            this.creatUserFavoriteIdMap(favorites);

            localStorage.setItem('userFavorites', JSON.stringify(this.userFavoritesMap));

          },
          error: (err) => {
            console.error(err);
          }
        });

      },
      error: (err) => { 
        console.error('Observable emitted an error: ' + err);
      }

    });
  }

  removeFavorite(artistId: string) {
    const data = {
      artistId: artistId
    }
    this.http.post(`/api/artsy/removeFavorite/`, data, {withCredentials: true
      }).subscribe(response => {
      // console.log(response);
    })
  }

}
