import { MovieDetails } from "./movie-details";

export type LatestDisplayed = Array<Pick<MovieDetails, 'Poster' | 'Title' | 'imdbID'>>;