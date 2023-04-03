package main

import (
	"net/http"
	"strings"
	"time"

	tmdb "github.com/cyruzin/golang-tmdb"
)

type MovieData struct {
	Title         string   `json:"title"`
	Year          string   `json:"year"`
	Poster        string   `json:"poster"`
	Score         int      `json:"score"`
	LengthMinutes int      `json:"lengthMinutes"`
	Description   string   `json:"description"`
	Directors     []string `json:"directors"`
	Actors        []string `json:"actors"`
	Genres        []string `json:"genres"`
}

func TmdbClient() (*tmdb.Client, error) {
	apiKey, err := getSSMParameter("weekend-movie-suggestor.TMDB_API_KEY_V3")
	if err != nil {
		return nil, err
	}

	tmdbClient, err := tmdb.Init(apiKey)
	if err != nil {
		return nil, err
	}

	// OPTIONAL: Setting a custom config for the http.Client.
	// The default timeout is 10 seconds. Here you can set other
	// options like Timeout and Transport.
	customClient := http.Client{
		Timeout: time.Second * 5,
		Transport: &http.Transport{
			MaxIdleConns:    10,
			IdleConnTimeout: 15 * time.Second,
		},
	}

	tmdbClient.SetClientConfig(customClient)
	// OPTIONAL (Recommended): Enabling auto retry functionality.
	// This option will retry if the previous request fail (429 TOO MANY REQUESTS).
	tmdbClient.SetClientAutoRetry()

	return tmdbClient, nil
}

func SearchMovie(client *tmdb.Client, query string) (*MovieData, error) {
	resp, err := client.GetSearchMovies(query, map[string]string{"include_adult": "true"})
	if err != nil {
		return nil, err
	}
	if len(resp.Results) == 0 {
		return nil, nil
	}
	movie := resp.Results[0]

	detail, err := client.GetMovieDetails(int(movie.ID), nil)
	if err != nil {
		return nil, err
	}
	if detail == nil { // movie not found
		return nil, nil
	}
	credits, err := client.GetMovieCredits(int(movie.ID), nil)
	if err != nil {
		return nil, err
	}
	if credits == nil { // movie not found
		return nil, nil
	}

	movieData := &MovieData{
		Title:         movie.Title,
		Year:          strings.Split(movie.ReleaseDate, "-")[0],
		Score:         int(movie.VoteAverage),
		LengthMinutes: 0,
		Description:   movie.Overview,
		Directors:     []string{},
		Actors:        []string{},
		Poster:        "https://image.tmdb.org/t/p/w500" + movie.PosterPath,
		Genres:        []string{},
	}

	movieData.LengthMinutes = detail.Runtime
	for _, actor := range credits.Cast {
		movieData.Actors = append(movieData.Actors, actor.Name)
	}
	for _, genre := range detail.Genres {
		movieData.Genres = append(movieData.Genres, genre.Name)
	}
	for _, crew := range credits.Crew {
		if crew.Job == "Director" {
			movieData.Directors = append(movieData.Directors, crew.Name)
		}
	}
	return movieData, nil
}

// func MovieTitleSearch(query string) (*MovieTitleSearchResponse, error) {
// 	client := http.Client{
// 		Transport: &TransportForRapidAPI{
// 			Headers: map[string]string{
// 				"X-RapidAPI-Key":  "3f63d246fbmsh90c226b875692c7p196143jsn7b0cb6fb6372",
// 				"X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
// 			},
// 		},
// 	}
// 	resp, err := client.Get("https://moviesdatabase.p.rapidapi.com/titles/search/title/%7Btitle%7D")
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer resp.Body.Close()
// 	bytes, err := io.ReadAll(resp.Body)
// 	if err != nil {
// 		return nil, err
// 	}
// 	movieTitleSearchResponse := MovieTitleSearchResponse{}
// 	if err := json.Unmarshal(bytes, &movieTitleSearchResponse); err != nil {
// 		return nil, err
// 	}
// 	return &movieTitleSearchResponse, nil
// }
