import { Movies } from './movies';

export interface SearchResponse {
  Search: Movies;
  totalResults: string;
  Response: string;
}
