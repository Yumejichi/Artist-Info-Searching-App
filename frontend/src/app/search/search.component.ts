import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ArtistService } from '../artist.service';
import { ArtistData } from '../artist-data-model';
import { ArtistInfoData } from '../artist-info-data-model';
import { ArtistArtwork } from '../artist-artwork-model';
import { ArtworkCategory } from '../artwork-category-model';
import { AuthenticationService } from '../authentication.service';
import { NotificationService } from '../notification.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit, OnDestroy{
  router = inject(Router);

  refreshedId: string | null = null;


  artistsData: ArtistData[] = [];
  similarArtists: ArtistData[] = [];
  tempSimilarArtists: ArtistData[] = [];
  artistInfoData: ArtistInfoData = {
    name: "",
    birthday: "",
    deathday: "",
    nationality: "",
    biography: ""
  };
  artistArtworks: ArtistArtwork[] = [];
  artworkCategories: ArtworkCategory[] = [];
  categoriesData: any = {
    artworkCategories: [],
    artworkname: "",
    artworkImage: "",
    year: "",
  }

  isLoading: boolean = false;
  isLoadingDetail: boolean = false;
  similarArtistLoaded:boolean = false;
  artistInfoLoaded:boolean = false;
  artworksLoaded:boolean = false;
  isCardClicked = false;
  clickedArtistCardId: string = "";
  selectedTab = "ArtistInfo";
  noData: boolean = false;
  noArtworks: boolean = false;
  noCategoty: boolean = false;

  isLoadingCategory: boolean = false;
  isViewButtonClicked: boolean = false;
  firstTimeLoading: boolean = true;

  userIsLoggedIn = false;
  starClicked = false;

  favorites: any = {};
  private authStateSubscription: Subscription | null = null;
  private userDataSubscription: Subscription | null = null;
  userFavoritesSet: Set<string> = new Set<string>();
  
  constructor(private artistService: ArtistService, private authenticationService: AuthenticationService,
    private notificationService: NotificationService, private route: ActivatedRoute, 
    private location: Location
    ) {}

  
  ngOnInit(): void {

    // this.isLoading= false;
    // this.isLoadingDetail = false;
    // this.isLoadingCategory = false;
          // this.similarArtistLoaded = true;
    // this.userIsLoggedIn = this.authenticationService.getIsLoggedIn();
    const currentUrl = this.router.url;
    // console.log("current url: ", currentUrl);
    const startIndex = currentUrl.indexOf("/search");
    const elems: string[] = currentUrl.substring(startIndex).split("/");

    if (elems.length === 3 && elems[1] === "search") {
      this.refreshedId = elems[2];
      //clickid
      this.clickedArtistCardId = this.refreshedId;

    }

    if (this.clickedArtistCardId) {
      this.onClickCard(this.clickedArtistCardId);
    }

    this.userIsLoggedIn = this.authenticationService.getIsLoggedIn();
    this.authStateSubscription = this.authenticationService.getAuthState().subscribe(isLoggedIn => {
      this.userIsLoggedIn = isLoggedIn;
      // console.log("is logeed in?: ", this.userIsLoggedIn)
      this.userFavoritesSet = this.authenticationService.getUserFavoritSet();
      
      if (this.userIsLoggedIn && this.clickedArtistCardId) {
        this.getSimilarArtists(this.clickedArtistCardId);
      }
    });

  }

  

  checkDetailAllLoaded() {
    if (this.userIsLoggedIn) {
      if (this.similarArtistLoaded && this.artistInfoLoaded && this.artworksLoaded) {
        this.similarArtists = this.tempSimilarArtists;
        this.tempSimilarArtists = [];
        this.isLoadingDetail = false;
        this.firstTimeLoading = false;

      }
    } else {
      if (this.artistInfoLoaded && this.artworksLoaded) {
        this.isLoadingDetail = false;
        this.firstTimeLoading = false;
      }
    }
    // console.log("Check Loading:", {
    //   loggedIn: this.userIsLoggedIn,
    //   similarArtistLoaded: this.similarArtistLoaded,
    //   artistInfoLoaded: this.artistInfoLoaded,
    //   artworksLoaded: this.artworksLoaded,
    //   isLoadingDetail: this.isLoadingDetail,
    // });
  }

  getSimilarArtists(artistId: string) {

    let res: ArtistData[] = [];
    this.tempSimilarArtists = [];
    //if logged in, get similar artists
    this.artistService.getSimilarArtistById(artistId).subscribe(response => {
      // console.log("similar artists: " +  JSON.stringify(response));
      
      for (let artist of response) {
        // console.log(artist);
        // console.log(artist._links.thumbnail.href)
        let artist_name: string = artist.name;
        let imageUrl = "assets/images/artsy_logo.svg";
        let artist_id = artist.id;

        if (
          artist &&
          artist._links &&
          artist._links.thumbnail &&
          artist._links.thumbnail.href &&
          !artist._links.thumbnail.href.includes("missing_image")
        ) {
          imageUrl = artist._links.thumbnail.href;
        }
        const artistData: ArtistData = {
          name: artist_name,
          imageUrl: imageUrl,
          artist_id: artist_id
        }
        res.push(artistData);
      }

      this.tempSimilarArtists = res;
      // console.log("similar artists:" + this.similarArtists);
      this.similarArtistLoaded = true;
      this.checkDetailAllLoaded();  

    });
  }


  onSearch(form: NgForm) {
    if (form.invalid) {
       return;
     }
     this.isLoading = true;
    const artistName: string = form.value.artistName; 
    let res: ArtistData[] = [];

    this.artistService.getArtistsByName(artistName).subscribe(response => {
        for (let artist of response) {
          // console.log(artist.title);
          // console.log(artist._links.thumbnail.href)
          let artist_name: string = artist.title;
          let imageUrl: string =  "assets/images/artsy_logo.svg";
          let common_url_before_id:string = "https://api.artsy.net/api/artists/";
          let artist_id:string = artist._links.self.href.substring(common_url_before_id.length);

          // console.log("artist_id", artist_id)
          if (imageUrl === "/assets/shared/missing_image.png") {
            imageUrl = "assets/images/artsy_logo.svg";
          }
          if (
            artist &&
            artist._links &&
            artist._links.thumbnail &&
            artist._links.thumbnail.href &&
            !artist._links.thumbnail.href.includes("missing_image")
          ) {
            imageUrl = artist._links.thumbnail.href;
          }
          const artistData: ArtistData = {
            name: artist_name,
            imageUrl: imageUrl,
            artist_id: artist_id
          }
          res.push(artistData);

      }
      this.artistsData = res;

      this.isCardClicked = false; 
      this.clickedArtistCardId = "";
      this.noData = false;
      this.firstTimeLoading = true;
      this.location.replaceState(`/search`);
      // localStorage.setItem("artistsData", JSON.stringify(this.artistsData));
      if (res.length === 0) {
        this.noData = true;
      }

     this.isLoading = false;
    });
  }

  onClickCard( artistId: string) {
    if (this.starClicked) {
      this.starClicked = false;
      return;
    }
    this.isCardClicked = true;
    this.clickedArtistCardId = artistId;
    
    this.location.replaceState(`/search/${artistId}`);
    // this.router.navigate(['/search', artistId], { replaceUrl: true });

    this.noArtworks = false;
    // console.log(artistId)
    this.isLoadingDetail = true;

    this.artistInfoLoaded = false;
    this.artworksLoaded = false;
    this.similarArtistLoaded = false;


    if (this.firstTimeLoading) {
      this.similarArtists = [];
    }

    let artistInfoDataFromServer: ArtistInfoData  = {
        name: "",
        birthday: "",
        deathday: "",
        nationality: "",
        biography: ""
    };
    this.artistService.getArtistInfoById(artistId).subscribe((response:any) => {
      artistInfoDataFromServer.name = response.name;
      artistInfoDataFromServer.birthday = response.birthday;
      artistInfoDataFromServer.deathday = response.deathday;
      artistInfoDataFromServer.nationality = response.nationality;

      //get all paragraphs:
      let biography: string = response.biography || "";
      biography = biography.replace(/-\s(?=\w)/g, "");
      biography = biography.replace(/\n\n/g, "</p><p>");
      biography = biography.replace(/\n/g, "<br>");
      artistInfoDataFromServer.biography = "<p>" + biography + "</p>";

 

      this.artistInfoData = artistInfoDataFromServer;
      // localStorage.setItem("artistInfoData", JSON.stringify(this.artistInfoData));
      this.artistInfoLoaded = true;

      this.checkDetailAllLoaded();

    });
    // console.log(this.artistInfoData);

    // then get the artworks:getArtworksById
    let artistArtworksFromServer: ArtistArtwork[] = [] 
    this.artistService.getArtworksById(artistId).subscribe((response:any) => {
      // console.log("line245: " + JSON.stringify(response));
      const artworkInfo = response._embedded.artworks
      if (artworkInfo.length === 0) {
        this.noArtworks = true;
      }
      for (let artwork of artworkInfo) {
        let singleArtwork: ArtistArtwork  = {
          artworkId: "",
          imageUrl: "assets/images/artsy_logo.svg",
          name: "",
          year: ""
        };
        singleArtwork.artworkId = artwork.id;
        if (artwork._links && artwork._links.thumbnail && artwork._links.thumbnail.href) {
          singleArtwork.imageUrl = artwork._links.thumbnail.href;
        }
        singleArtwork.name = artwork.title;
        singleArtwork.year = artwork.date;
        // console.log(singleArtwork)
        artistArtworksFromServer.push(singleArtwork);
      }
      this.artistArtworks = artistArtworksFromServer;
      this.artworksLoaded = true;
      this.checkDetailAllLoaded();
      // localStorage.setItem("artistArtworks", JSON.stringify(this.artistArtworks));

    });

    if (this.userIsLoggedIn) {

      this.getSimilarArtists(artistId);
    }

  }

  onClickViewCatrgoryButton(artwork: ArtistArtwork) {
    // console.log(artwork.artworkId)
    this.isViewButtonClicked = true;
    this.noCategoty = false;
    this.isLoadingCategory = true;

    this.categoriesData.artworkname = artwork.name
    this.categoriesData.artworkImage = artwork.imageUrl;
    this.categoriesData.year = artwork.year;

    let artworkCategories: ArtworkCategory[] = [];
    this.artistService.getCategoriesById(artwork.artworkId).subscribe((response:any) => {
      const categories = response._embedded.genes
      if (categories.length === 0) {
        this.noCategoty = true;
      }
      for (let category of categories) {
        let eachCategory: ArtworkCategory  = {
          name: "",
          imageUrl: "",
        };
        eachCategory.name = category.name;
        eachCategory.imageUrl = category._links.thumbnail.href;
        artworkCategories.push(eachCategory);
      }
      this.isLoadingCategory = false; 
      this.artworkCategories = artworkCategories;
      // localStorage.setItem("artworkCategories", JSON.stringify(this.artworkCategories));
      this.categoriesData.artworkCategories = artworkCategories;
      // localStorage.setItem("categoriesData", JSON.stringify(this.categoriesData));

    });
    // console.log("this.artworkCategories: " + this.artworkCategories);
  
  }


  setSelectedTab(tab: string) {
    this.selectedTab = tab;
    // localStorage.setItem("selectedTab", this.selectedTab);
  }

  toggleFavorites(artistId: string) {
    
    this.starClicked = true;
    if (this.userFavoritesSet.has(artistId)) {
      this.userFavoritesSet.delete(artistId);
      this.authenticationService.removeFavorite(artistId);
      this.notificationService.addNotification("danger", "Removed from favorites");
    } else {
      this.userFavoritesSet.add(artistId);
      this.authenticationService.addFavorite(artistId);

    this.notificationService.addNotification("success", "Added to favorites");
    }
  }

  resetPage() {
    this.artistsData = [];
    this.artistInfoData = {
      name: "",
      birthday: "",
      deathday: "",
      nationality: "",
      biography: ""
    };
    this.artistArtworks = [];
    this.artworkCategories = [];
    this.categoriesData = {
      artworkCategories: [],
      artworkname: "",
      artworkImage: "",
      year: "",
    }

    this.isLoading = false;
    this.isLoadingDetail = false;
    this.isCardClicked = false;
    this.clickedArtistCardId = "";
    this.selectedTab = "ArtistInfo";
    this.noData = false;
    this.noArtworks = false;
    this.noCategoty = false;

    this.isLoadingCategory = false;
    this.isViewButtonClicked = false;

    this.location.replaceState(`/search`);
    // this.router.navigate(['/search']);

    // localStorage.removeItem('artistsData');
    // localStorage.removeItem('clickedArtistCardId');
    // localStorage.removeItem('artistInfoData');
    // localStorage.removeItem('artistArtworks');
    // localStorage.removeItem('artworkCategories');
    // localStorage.removeItem('categoriesData');
    // localStorage.removeItem('selectedTab');
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
