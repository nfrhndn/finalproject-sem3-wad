const BASE_URL = "http://localhost:5000/api";
const MOVIE_BASE_URL = `${BASE_URL}/movies`;
const BOOKING_BASE_URL = `${BASE_URL}/bookings`;
const CART_BASE_URL = `${BASE_URL}/cart`;
const TICKET_BASE_URL = `${BASE_URL}/tickets`;

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

function logoutUser() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

function getValidToken(): string | null {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) return null;

  if (isTokenExpired(storedToken)) {
    logoutUser();
    return null;
  }
  return storedToken;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const currentToken = getValidToken();
  const headers = {
    ...(options.headers || {}),
    Authorization: currentToken ? `Bearer ${currentToken}` : "",
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res) throw new Error("Server tidak merespons");

    if (res.status === 401) {
      logoutUser();
      throw new Error("Sesi Anda telah berakhir");
    }

    if (!res.ok) throw new Error(`Request gagal (${res.status})`);
    return res.json();
  } catch (err: any) {
    if (
      err.message.includes("Failed to fetch") ||
      err.message.includes("NetworkError")
    ) {
      alert("Server sedang tidak dapat dijangkau. Silakan login ulang nanti.");
      logoutUser();
    }
    throw err;
  }
}

export const loginApi = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
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
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Register gagal");
  return res.json();
};

export const fetchPopularMovies = async () =>
  fetchWithAuth(`${MOVIE_BASE_URL}/popular`);
export const fetchMovieDetail = async (id: number) =>
  fetchWithAuth(`${MOVIE_BASE_URL}/${id}`);
export const fetchNowPlayingMovies = async () =>
  fetchWithAuth(`${MOVIE_BASE_URL}/now_playing`);
export const fetchUpcomingMovies = async () =>
  fetchWithAuth(`${MOVIE_BASE_URL}/upcoming`);

export const bookingApi = async (order: any) =>
  fetchWithAuth(`${BOOKING_BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

export const getCartApi = async () => fetchWithAuth(`${CART_BASE_URL}`);
export const addToCart = async (item: any) =>
  fetchWithAuth(`${CART_BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
export const removeFromCartApi = async (id: number) =>
  fetchWithAuth(`${CART_BASE_URL}/${id}`, { method: "DELETE" });
export const updateCartApi = async (id: number, item: any) =>
  fetchWithAuth(`${CART_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

export const checkoutApi = async (payload: any) =>
  fetchWithAuth(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const fetchProfileApi = async (userToken?: string) => {
  const t = userToken || localStorage.getItem("token");
  return fetchWithAuth(`${BASE_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${t}` },
  });
};

export const updateProfileApi = async (payload: any, userToken?: string) => {
  const t = userToken || localStorage.getItem("token");
  return fetchWithAuth(`${BASE_URL}/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    },
    body: JSON.stringify(payload),
  });
};

export const uploadAvatarApi = async (file: File) => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) throw new Error("Token tidak ditemukan");

  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch(`${BASE_URL}/user/profile/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("❌ Upload avatar gagal:", errText);
    throw new Error("Upload avatar gagal");
  }

  const data = await res.json();
  console.log("✅ Avatar upload success:", data);

  return data.avatar || data.path || data.user?.avatar || "";
};

export const fetchTickets = async () => {
  try {
    const data = await fetchWithAuth(`${BOOKING_BASE_URL}`);
    return data;
  } catch (error) {
    console.error("❌ Gagal fetch tiket:", error);
    return { success: false, bookings: [] };
  }
};
