import axios from "axios";

// ✅ Base URL langsung ke endpoint film backend kamu
const adminAxios = axios.create({
    baseURL: "http://localhost:5000/api/movies",
});

// ✅ Ambil token admin dari localStorage
function getAdminToken(): string | null {
    return (
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        null
    );
}

// ✅ Interceptor — kirim token hanya kalau ada
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

// ✅ Tipe data film
export interface Movie {
    id?: number;
    title: string;
    genre?: string;
    releaseDate: string;
    description?: string;
    poster?: string;
    status?: string;
    source?: string;
}

interface MoviesResponse {
    movies: Movie[];
}

// ✅ API CRUD untuk admin
export const adminApi = {
    // 🟢 Ambil semua film dari DB
    getMovies: async (): Promise<MoviesResponse> => {
        const res = await adminAxios.get<MoviesResponse>("/");
        return res.data;
    },

    // 🟡 Tambah film baru
    addMovie: async (data: FormData | Record<string, any>): Promise<Movie> => {
        const isFormData = data instanceof FormData;
        const res = await adminAxios.post<Movie>("/", data, {
            headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
        });
        return res.data;
    },

    // 🔵 Edit film
    updateMovie: async (id: number, data: FormData | Record<string, any>): Promise<Movie> => {
        const isFormData = data instanceof FormData;
        const res = await adminAxios.put<Movie>(`/${id}`, data, {
            headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
        });
        return res.data;
    },

    // 🔴 Hapus film
    deleteMovie: async (id: number): Promise<{ message: string }> => {
        const res = await adminAxios.delete<{ message: string }>(`/${id}`);
        return res.data;
    },
};
