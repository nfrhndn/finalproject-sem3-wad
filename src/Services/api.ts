const BASE_URL = "http://localhost:5000/api/movies";

export const fetchPopularMovies = async () => {
  const res = await fetch(`${BASE_URL}/popular`);
  if (!res.ok) {
    throw new Error("Gagal fetch popular movies");
  }
  return res.json();
};

export const fetchMovieDetail = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error("Gagal fetch movie detail");
  }
  return res.json();
};
