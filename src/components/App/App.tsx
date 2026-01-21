import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import { useState } from "react";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

const App = () => {
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const movieQuery = useQuery({
    enabled: query.length !== 0 && page > 0,
    queryKey: ["fetchMovies", query, page],
    queryFn: () => fetchMovies(query, page),
    placeholderData: keepPreviousData,
  });

  const loading = movieQuery.isLoading;
  const error = movieQuery.isError;
  const movies = movieQuery.data?.results || [];
  const totalPages = movieQuery.data?.total_pages ?? 0;

  const handleSubmit = async (query: string) => {
    setPage(1);
    setQuery(query);
  };
  return (
    <div className={css["app"]}>
      <div>
        <SearchBar onSubmit={handleSubmit} />
        {movieQuery && totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
        <MovieGrid movies={movies} onSelect={setModalMovie} />
        {loading && <Loader />}
        {error && <ErrorMessage />}
        {modalMovie && (
          <MovieModal
            movie={modalMovie}
            onClose={() => {
              setModalMovie(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
