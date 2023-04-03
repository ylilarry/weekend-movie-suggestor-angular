import { Component, Input } from "@angular/core";
import { CarouselMovie } from "src/app/movie-carousel.service";

@Component({
  selector: "app-movie-detail",
  templateUrl: "./movie-detail.component.html",
  styleUrls: ["./movie-detail.component.scss"],
})
export class MovieDetailComponent {
  @Input()
  movie: CarouselMovie | null = null;
}
