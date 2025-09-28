const MOVIE_BASE_URL = "http://localhost:5000/api/movies";
const AUTH_BASE_URL = "http://localhost:5000/api";

export const fetchPopularMovies = async () => {
  const res = await fetch(`${MOVIE_BASE_URL}/popular`);
  if (!res.ok) {
    throw new Error("Gagal fetch popular movies");
  }
  return res.json();
};

export const fetchMovieDetail = async (id: number) => {
  const res = await fetch(`${MOVIE_BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error("Gagal fetch movie detail");
  }
  return res.json();
};

export const loginApi = async (email: string, password: string) => {
  const res = await fetch(`${AUTH_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login gagal, periksa email/password");
  }

  return res.json();
};

export const registerApi = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${AUTH_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    throw new Error("Register gagal");
  }

  return res.json();
};
