import { Component, ElementRef, Input, ViewChild } from "@angular/core";
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

  @ViewChild("scrollEl")
  scrollEl?: ElementRef<HTMLElement>;

  handleScroll(event: Event) {
    if (this.scrollEl && event instanceof WheelEvent && event.deltaY != 0) {
      this.scrollEl.nativeElement.scrollBy({
        left: event.deltaY / 2,
      });
    }
  }
}
