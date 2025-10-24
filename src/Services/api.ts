export const API_BASE_URL = "http://localhost:5000/api";
export const BASE_API_URL = "http://localhost:5000/api";
export const BASE_STATIC_URL = "http://localhost:5000";
const MOVIE_BASE_URL = `${BASE_API_URL}/movies`;
const BOOKING_BASE_URL = `${BASE_API_URL}/bookings`;
const CART_BASE_URL = `${BASE_API_URL}/cart`;
const TICKET_BASE_URL = `${BASE_API_URL}/tickets`;

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
  const res = await fetch(`${BASE_API_URL}/login`, {
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
  const res = await fetch(`${BASE_API_URL}/register`, {
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

export const checkoutApi = async (payload: any, token: string) => {
  try {
    console.log("🔑 Token dikirim ke backend:", token?.slice(0, 20) + "...");

    const res = await fetch(`${BASE_API_URL}/cart/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 401 || res.status === 403) {
      console.warn("❌ Token tidak valid atau expired.");
      return {
        success: false,
        message: "Sesi kamu sudah berakhir. Silakan login ulang.",
      };
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Checkout gagal:", errText);
      return {
        success: false,
        message: `Gagal checkout: ${errText}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("🚨 Checkout API error:", err.message);
    return {
      success: false,
      message: "Terjadi kesalahan saat memproses pembayaran.",
    };
  }
};

export const fetchProfileApi = async (userToken?: string) => {
  const token = userToken || localStorage.getItem("token");

  if (!token) {
    console.warn("⚠️ Token tidak ditemukan di fetchProfileApi");
    throw new Error("Token tidak ditemukan. Silakan login ulang.");
  }

  try {
    const response = await fetch(`${BASE_API_URL}/user/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      console.warn("❌ Token kedaluwarsa / tidak valid, logout otomatis...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Sesi Anda telah berakhir. Silakan login ulang.");
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Gagal ambil profil:", errText);
      throw new Error("Gagal memuat profil pengguna.");
    }

    const data = await response.json();
    console.log("✅ Profil diterima:", data);
    return data;
  } catch (error) {
    console.error("🔥 Error di fetchProfileApi:", error);
    throw error;
  }
};

export const updateProfileApi = async (payload: any, userToken?: string) => {
  const token = userToken || localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan");

  try {
    const res = await fetch(`${BASE_API_URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Gagal memperbarui profil:", errorText);
      throw new Error(`Gagal update profil (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    console.log("✅ Profil berhasil diperbarui:", data);

    return data.user || data;
  } catch (error) {
    console.error("🚨 Terjadi kesalahan saat update profil:", error);
    throw error;
  }
};

export const uploadAvatarApi = async (file: File, userToken?: string) => {
  const token = userToken || localStorage.getItem("token");

  if (!token) {
    console.error("❌ Token tidak ditemukan saat upload avatar.");
    throw new Error("Token tidak ditemukan. Silakan login ulang.");
  }

  if (!file) {
    throw new Error("File avatar tidak ditemukan.");
  }

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    console.log("📤 Upload avatar dimulai...");

    const res = await fetch(`${BASE_API_URL}/user/profile/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Upload avatar gagal:", errText);
      throw new Error(`Upload avatar gagal (${res.status}): ${errText}`);
    }

    const data = await res.json();
    console.log("✅ Avatar berhasil diupload:", data);

    const newAvatarPath =
      data.user?.avatar || data.profile?.avatar || data.avatar || "";

    const fullUrl = newAvatarPath.startsWith("http")
      ? newAvatarPath
      : `${BASE_STATIC_URL}${newAvatarPath}`;

    console.log("🖼️ Avatar URL:", fullUrl);
    return fullUrl;
  } catch (error) {
    console.error("🚨 Kesalahan upload avatar:", error);
    throw error;
  }
};

export const fetchTickets = async () => {
  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      localStorage.getItem("adminToken");

    if (!token) {
      console.warn("⚠️ Tidak ada token di localStorage (user belum login)");
      return {
        success: false,
        message: "Sesi kamu sudah berakhir. Silakan login ulang.",
        bookings: [],
      };
    }

    const res = await fetch(`${BOOKING_BASE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();
    console.log("📩 Response dari /bookings:", text);

    if (res.status === 401 || res.status === 403) {
      console.warn("❌ Token invalid atau expired. Menghapus sesi...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userToken");
      localStorage.removeItem("adminToken");
      return {
        success: false,
        message: "Sesi kamu sudah berakhir. Silakan login ulang.",
        bookings: [],
      };
    }

    if (!res.ok) {
      console.error(`❌ HTTP Error ${res.status}: ${text}`);
      return {
        success: false,
        message: `Gagal memuat tiket. Kode: ${res.status}`,
        bookings: [],
      };
    }

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      console.error("❌ Response bukan JSON valid:", err);
      return {
        success: false,
        message: "Server mengirim data tidak valid.",
        bookings: [],
      };
    }

    if (!data.success || !Array.isArray(data.bookings)) {
      console.warn("⚠️ Struktur data tiket tidak sesuai:", data);
      return {
        success: false,
        bookings: [],
        message: data.message || "Tidak ada data tiket.",
      };
    }

    console.log("✅ Data tiket berhasil diterima:", data);
    return data;
  } catch (error) {
    console.error("🔥 Gagal fetch tiket:", error);
    return {
      success: false,
      bookings: [],
      message: "Terjadi kesalahan saat memuat tiket.",
    };
  }
};
