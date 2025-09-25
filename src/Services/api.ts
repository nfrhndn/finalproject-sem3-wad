const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchPopularMovies = async () => {
    const res = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=id-ID&page=1`
    );
    return res.json();
};

export const fetchMovieDetail = async (id: number) => {
    const res = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=id-ID`
    );
    return res.json();
};
