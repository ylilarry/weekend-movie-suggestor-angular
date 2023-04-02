import { Component, Input } from "@angular/core";
import { CarouselMovie } from "src/app/carousel/carousel.component";

@Component({
  selector: "app-movie-detail",
  templateUrl: "./movie-detail.component.html",
  styleUrls: ["./movie-detail.component.scss"],
})
export class MovieDetailComponent {
  @Input()
  movie: CarouselMovie | null = null;
}
