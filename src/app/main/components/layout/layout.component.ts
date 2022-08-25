import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService, IMovieDetails, ISearch } from '../../services/api.service';
import { DialogComponent } from '../dialog/dialog.component';
import { IPage } from '../paginator/paginator.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  
  movieTitle: any;

  details: IMovieDetails = {
    Plot: '',
    Poster: '',
    Actors: '',
    Released: '',
    imdbRating: '',
  };

  movies: ISearch[] = [];

  pagesTotal = 0;

  constructor(private ApiService: ApiService, private dialog: MatDialog) {}

  searchForMovie(movieTitle: any) {
    this.movieTitle = movieTitle;
    this.ApiService.getMovies(movieTitle.replace( / /g, "+" ), 1).subscribe((res) => {
      this.movies = res.Search;
      this.pagesTotal = +res.totalResults;
    });
  }

  findMovieDetails(movie: any) {
    this.ApiService.findMovieDetails(movie.imdbID).subscribe((details) => {
      this.details = details;
      this.dialog.open(DialogComponent, { data: { ...this.details } });
    });
  }

  getMovies(page: IPage) {
    this.ApiService.getMovies(this.movieTitle, page.pageIndex + 1).subscribe(
      (res) => {
        this.pagesTotal = +res.totalResults;
        this.movies = res.Search;
      }
    );
  }

  ngOnInit(): void {
    this.movieTitle = 'Batman';
    this.ApiService.getMovies('Batman', 1).subscribe((res) => {
      this.movies = res.Search;
      this.pagesTotal = +res.totalResults;
    });
  }
}
