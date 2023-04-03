import { BreakpointObserver } from "@angular/cdk/layout";
import { Component, Input } from "@angular/core";
import { CarouselMovie } from "src/app/movie-carousel.service";

@Component({
  selector: "app-movie-detail",
  templateUrl: "./movie-detail.component.html",
  styleUrls: ["./movie-detail.component.scss"],
})
export class MovieDetailComponent {
  constructor(private breakpointObserver: BreakpointObserver) {}

  @Input()
  movie: CarouselMovie | null = null;

  useSingleColumnLayout() {
    return this.breakpointObserver.isMatched(`(max-width: 600px)`);
  }

  detailTileStyle() {
    const opacity = 0.95;
    return {
      "background-image": `linear-gradient(rgba(0, 0, 0, ${opacity}), rgba(0, 0, 0, ${opacity})), url(${this.movie?.poster})`,
    };
  }

  dropbackFilterStyle() {
    if (this.useSingleColumnLayout()) {
      return {
        "backdrop-filter": "blur(5px)",
        "-webkit-backdrop-filter": "blur(5px)",
      };
    } else {
      return {};
    }
  }
}
