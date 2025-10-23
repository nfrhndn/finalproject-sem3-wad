// src/pages/admin/EditMovie.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MovieForm from "../../components/admin/MovieForm";
import { adminApi } from "../../Services/adminApi";

export default function EditMovie() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<any>(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await adminApi.getMovies();
                const found = res.movies.find((m) => m.id === Number(id));
                setMovie(found);
            } catch (err) {
                console.error("Gagal memuat film", err);
            }
        };
        fetchMovie();
    }, [id]);

    const handleUpdate = async (data: any) => {
        try {
            await adminApi.updateMovie(Number(id), data);
            alert("Film berhasil diperbarui!");
            navigate("/admin/movies");
        } catch (err) {
            alert("Gagal memperbarui film");
            console.error(err);
        }
    };

    if (!movie) return <p className="text-center mt-10">Memuat data...</p>;

    return <MovieForm initialData={movie} onSubmit={handleUpdate} isEdit />;
}
