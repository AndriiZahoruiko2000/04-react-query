import axios from "axios";
import type { Movie } from "../types/movie";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMovieResponse {
  results: Movie[];
  page: number;
  total_results: number;
  total_pages: number;
}

export async function fetchMovies(query: string, page: number) {
  const baseURL = "https://api.themoviedb.org/3";
  const endPoint = "/search/movie";
  const url = baseURL + endPoint;

  const params = {
    query,
    page,
  };

  const headers = {
    Authorization: `Bearer ${TMDB_TOKEN}`,
  };

  const res = await axios.get<FetchMovieResponse>(url, { headers, params });
  return res.data;
}
