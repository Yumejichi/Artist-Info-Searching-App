import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArtistData } from './artist-data-model';


@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  constructor(private http: HttpClient) { }

  getArtistsByName(name: string): Observable<any[]> {
    let url = `/api/artsy/search/${name}`;
    return this.http.get<any[]>(url);
  }

  getArtistInfoById(id: string): Observable<any[]> {
    let url = `/api/artsy/details/${id}`;
    return this.http.get<any[]>(url);
  }

  getArtworksById(id: string): Observable<any[]> {
    let url = `/api/artsy/artworks/${id}`;
    return this.http.get<any[]>(url);
  }

  getCategoriesById(id: string): Observable<any[]> {
    let url = `/api/artsy/category/${id}`;
    return this.http.get<any[]>(url);
  }

  getSimilarArtistById(id: string): Observable<any[]> {
    // console.log("fetch the similar artist: ")
    let url = `/api/artsy/similar/${id}`;
    return this.http.get<any[]>(url);
  }
}
