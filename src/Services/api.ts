const MOVIE_BASE_URL = "http://localhost:5000/api/movies";
const AUTH_BASE_URL = "http://localhost:5000/api";
const BOOKING_BASE_URL = "http://localhost:5000/api/booking";
const CART_BASE_URL = "http://localhost:5000/api/cart";
const TICKET_BASE_URL = "http://localhost:5000/api/tickets";

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
  const res = await fetch(`${BOOKING_BASE_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error("Booking gagal");
  return res.json();
};

export const addToCart = async (item: any) => {
  const res = await fetch(`${CART_BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Gagal menambahkan ke cart");
  return res.json();
};

export const getCartApi = async () => {
  const res = await fetch(`${CART_BASE_URL}`);
  if (!res.ok) throw new Error("Gagal ambil cart");
  return res.json();
};

export const removeFromCartApi = async (id: number) => {
  const res = await fetch(`${CART_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Gagal hapus item");
  return res.json();
};

export const updateCartApi = async (id: number, item: any) => {
  const res = await fetch(`${CART_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Gagal update item cart");
  return res.json();
};

export const checkoutApi = async (payload: any) => {
  const res = await fetch(`${CART_BASE_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Checkout gagal");
  return res.json();
};

export const fetchTickets = async () => {
  const res = await fetch(`${TICKET_BASE_URL}`);
  if (!res.ok) throw new Error("Gagal fetch tickets");
  return res.json();
};

export async function fetchProfileApi(token: string) {
  const res = await fetch("http://localhost:5000/api/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Gagal ambil profil");
  return res.json();
}

export const updateProfileApi = async (payload: any, token?: string) => {
  const t = token || localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/user/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Gagal update profil");
  return res.json();
};

export const uploadAvatarApi = async (file: File, token?: string) => {
  const t = token || localStorage.getItem("token");
  const fd = new FormData();
  fd.append("avatar", file);

  const res = await fetch("http://localhost:5000/api/user/profile/avatar", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${t}`,
    },
    body: fd,
  });

  if (!res.ok) throw new Error("Gagal upload avatar");
  return res.json();
};
