import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription, pipe } from 'rxjs';
import { Router } from '@angular/router'
import { AuthenticationService } from '../authentication.service';
import { NotificationService } from '../notification.service';
import { FavoriteArtist } from '../favorite-artist-model'

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  userIsLoggedIn: boolean = false;
  isLoadingFavorites: boolean = false;
  userFavoritesSet: Set<string> = new Set<string>();
  userFavorites: { [key: string]: FavoriteArtist } = {};
  sortedFavoriteIds: string[] = [];
  keys = Object.keys;

  noUserFavorites: boolean = false;
  private intervalId: any;
  
  private authStateSubscription: Subscription | null = null;
  private userDataSubscription: Subscription | null = null;

  constructor(private authenticationService: AuthenticationService, 
    private notifivationService: NotificationService, private router: Router,
    private cdRef: ChangeDetectorRef) {}


  ngOnInit() {
    this.isLoadingFavorites = true;
    this.authStateSubscription = this.authenticationService.getAuthState().subscribe(isLoggedIn => {

      this.userIsLoggedIn = isLoggedIn;


      if (this.userIsLoggedIn) {
        const favoritesDataFromLS = localStorage.getItem('userFavorites');
        if (favoritesDataFromLS) {
  
          const favoritesData = JSON.parse(favoritesDataFromLS);
  
          for (const key of Object.keys(favoritesData)) {
            favoritesData[key].favoritedTime = new Date(favoritesData[key].favoritedTime);
          }
  
          this.userFavorites = favoritesData;

          this.userFavoritesSet = this.authenticationService.getUserFavoritSet();
          this.sortedFavoriteIds = Object.keys(this.userFavorites).sort((a, b) => {
            const dateA = new Date(this.userFavorites[a].favoritedTime).getTime();
            const dateB = new Date(this.userFavorites[b].favoritedTime).getTime();
            return dateB - dateA;
          });
  
          if (Object.keys(this.userFavorites).length === 0) {
            this.noUserFavorites = true;
          } 
  
          // console.log ("userInfo.userFavorite: ", this.userFavorites);
  
          this.isLoadingFavorites = false;
          this.cdRef.detectChanges();
        } else {
          this.userDataSubscription = this.authenticationService.getUserDataObservable().subscribe(userData => {
            const userFavorites = userData.userFavorites as { [key: string]: FavoriteArtist };
            this.userFavorites = userFavorites;
            
            for (const key of Object.keys(userFavorites)) {
              userFavorites[key].favoritedTime = new Date(userFavorites[key].favoritedTime);
            }
      
            this.userFavoritesSet = this.authenticationService.getUserFavoritSet();
            this.sortedFavoriteIds = Object.keys(this.userFavorites).sort((a, b) => {
              const dateA = new Date(this.userFavorites[a].favoritedTime).getTime();
              const dateB = new Date(this.userFavorites[b].favoritedTime).getTime();
              return dateB - dateA;
            });
      
            this.noUserFavorites = Object.keys(this.userFavorites).length === 0;
            this.isLoadingFavorites = false;
            this.cdRef.detectChanges();
          });
        }
      }

    });
    

    this.intervalId = setInterval(() => {
      this.cdRef.detectChanges();
    }, 1000);
    
  }

  onClickCard(artistId: string) {

    this.router.navigate(['/search', artistId]);


  }

  onremoveFavorite(artistId: string) {
    this.authenticationService.removeFavorite(artistId);

    delete this.userFavorites[artistId];
    if (this.userFavoritesSet.has(artistId)) {
      this.userFavoritesSet.delete(artistId);
    }
    this.sortedFavoriteIds = this.sortedFavoriteIds.filter(id => id !== artistId);

    // update local storage
    localStorage.setItem('userFavorites', JSON.stringify(this.userFavorites));
    if (Object.keys(this.userFavorites).length === 0) {
      this.noUserFavorites = true;
    }

    this.notifivationService.addNotification("danger", "Removed from favorites");

    // console.log(this.userFavoritesSet)

  }



  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
      
  }

}
