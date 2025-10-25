import axios from "axios";

const adminAxios = axios.create({
  baseURL: "http://localhost:5000/api/movies",
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
      console.warn(
        "⚠️ Token admin tidak ditemukan. Pastikan sudah login admin."
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  description?: string;
  duration?: number | null;
  releaseDate?: string;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  isPublished?: boolean;
  status?: string;
}

interface MoviesResponse {
  movies: Movie[];
}

export const adminApi = {
  getMovies: async (): Promise<MoviesResponse> => {
    const res = await adminAxios.get<MoviesResponse>("/");
    return res.data;
  },

  addMovie: async (data: FormData | Record<string, any>): Promise<Movie> => {
    const isFormData = data instanceof FormData;
    const res = await adminAxios.post<Movie>("/", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  },

  updateMovie: async (
    id: number,
    data: FormData | Record<string, any>
  ): Promise<Movie> => {
    const isFormData = data instanceof FormData;
    const res = await adminAxios.put<Movie>(`/${id}`, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  },

  deleteMovie: async (id: number): Promise<{ message: string }> => {
    const res = await adminAxios.delete<{ message: string }>(`/${id}`);
    return res.data;
  },
};
