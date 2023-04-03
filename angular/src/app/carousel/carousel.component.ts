import { Component, Input } from "@angular/core";
import { CarouselMovie } from "src/app/movie-carousel.service";

export type CarouselConfig = {
  imageSize: { height: number; width: number };
  onClick: (event: Event, movie: CarouselMovie) => void;
};

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.scss"],
})
export class CarouselComponent {
  @Input()
  movies: CarouselMovie[] = [];

  @Input()
  config!: CarouselConfig;
}
