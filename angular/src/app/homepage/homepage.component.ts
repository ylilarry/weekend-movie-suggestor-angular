import { Component, OnInit } from "@angular/core";
import {
  type CarouselConfig,
  type CarouselMovie,
} from "src/app/carousel/carousel.component";
import { MovieCarouselService } from "src/app/movie-carousel.service";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"],
  providers: [MovieCarouselService],
})
export class HomepageComponent implements OnInit {
  constructor(private movieCarouselService: MovieCarouselService) {}
  carouselConfig: CarouselConfig = {
    imageSize: { height: 300, width: 200 },
    onClick: (event: Event, movie: CarouselMovie) => {
      this.movieModalAnchorEl = event.target as HTMLElement;
      this.movieModalMovie = movie;
      this.movieModalShow = true;
    },
  };
  movies: CarouselMovie[] = [];
  movieModalAnchorEl: HTMLElement | null = null;
  movieModalShow: boolean = false;
  // movieModalMovie: CarouselMovie | null = movies[0]; // TODO:
  movieModalMovie: CarouselMovie | null = null;
  movieModalOnClose = () => {
    this.movieModalShow = false;
  };

  ngOnInit() {
    this.movieCarouselService.load();
    this.movieCarouselService.getMovies().subscribe((movies) => {
      this.movies.push(...movies);
    });
  }
}
