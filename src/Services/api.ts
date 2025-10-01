const MOVIE_BASE_URL = "http://localhost:5000/api/movies";
const AUTH_BASE_URL = "http://localhost:5000/api";
const BOOKING_BASE_URL = "http://localhost:5000/api/booking";

export const fetchPopularMovies = async () => {
  const res = await fetch(`${MOVIE_BASE_URL}/popular`);
  if (!res.ok) throw new Error("Gagal fetch popular movies");
  return res.json();
};

export const fetchMovieDetail = async (id: number) => {
  const res = await fetch(`${MOVIE_BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Gagal fetch movie detail");
  return res.json();
};

export const fetchNowPlayingMovies = async () => {
  const res = await fetch(`${MOVIE_BASE_URL}/now_playing`);
  if (!res.ok) throw new Error("Gagal fetch now playing movies");
  return res.json();
};

export const fetchUpcomingMovies = async () => {
  const res = await fetch(`${MOVIE_BASE_URL}/upcoming`);
  if (!res.ok) throw new Error("Gagal fetch upcoming movies");
  return res.json();
};

export const loginApi = async (email: string, password: string) => {
  const res = await fetch(`${AUTH_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login gagal, periksa email/password");

  return res.json();
};

export const registerApi = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${AUTH_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) throw new Error("Register gagal");

  return res.json();
};

export const bookingApi = async (order: any) => {
  const res = await fetch(BOOKING_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  if (!res.ok) throw new Error("Booking gagal");

  return res.json();
};
