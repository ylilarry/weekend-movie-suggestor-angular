import { Component, Input } from "@angular/core";

export type CarouselMovie = {
  imgUrl: string;
  imgUrlStyle: string;
  title: string;
  score: number;
  genres: string[];
  year: number;
  rating: string;
  length: string;
  description: string;
  directors: string[];
  stars: string[];
};

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
