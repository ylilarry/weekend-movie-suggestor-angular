import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, BehaviorSubject, timeInterval } from "rxjs";

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

const movies: CarouselMovie[] = Array(1).fill({
  imgUrl: "./assets/posters/1.jpg",
  imgUrlStyle: `url("./assets/posters/1.jpg")`,
  title: "Movie 1",
  rating: "R",
  genres: ["Action", "Adventure", "Fantasy"],
  year: 2019,
  score: 8.5,
  length: "2h 10m",
  description:
    "A twisted tale of two estranged sisters whose reunion is cut short by the rise of flesh-possessing demons, thrusting them into a primal battle for survival as they face the most nightmarish version of family imaginable.",
  directors: ["James Wan"],
  stars: ["Lili Reinhart", "Madison Iseman", "Camila Mendes"],
});

@Injectable({
  providedIn: "root",
})
export class MovieCarouselService {
  constructor(private http: HttpClient) {}
  movies = new BehaviorSubject<CarouselMovie[]>([]);

  async load(): Promise<void> {
    for (let i = 0; i < 5; i++) {
      this.movies.next(movies);
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    }
  }

  getMovies(): Observable<CarouselMovie[]> {
    return this.movies;
  }
}
