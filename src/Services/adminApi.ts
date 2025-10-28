import axios from "axios";

const adminAxios = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

function getAdminToken(): string | null {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    null
  );
}

adminAxios.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    config.headers = config.headers ?? {};

    if (token && token.trim() !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ Token admin tidak ditemukan. Pastikan sudah login admin.");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export interface Movie {
  id: number;
  title: string;
  description?: string;
  releaseDate?: string;
  posterUrl?: string | null;
  trailerUrl?: string | null;
  isPublished?: boolean;
}

export const adminApi = {
  getMovies: async () => {
    const res = await adminAxios.get("/movies");
    return res.data;
  },

  addMovie: async (data: FormData | Record<string, any>) => {
    const isFormData = data instanceof FormData;
    const res = await adminAxios.post("/movies", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  },

  updateMovie: async (id: number, data: FormData | Record<string, any>) => {
    const isFormData = data instanceof FormData;
    const res = await adminAxios.put(`/movies/${id}`, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  },

  deleteMovie: async (id: number) => {
    const res = await adminAxios.delete(`/movies/${id}`);
    return res.data;
  },
};
