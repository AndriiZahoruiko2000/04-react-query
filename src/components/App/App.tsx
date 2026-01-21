import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import { useState } from "react";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);

  const handleSubmit = async (query: string) => {
    setMovies([]);
    setLoading(true);
    setError(false);
    try {
      const response = await fetchMovies(query);
      console.log(response);

      if (response.results.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(response.results);
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };
  return (
    <div className={css["app"]}>
      <div>
        <SearchBar onSubmit={handleSubmit} />
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
        <Toaster />
      </div>
    </div>
  );
};

export default App;
