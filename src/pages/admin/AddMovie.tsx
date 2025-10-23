// src/pages/admin/AddMovie.tsx
import MovieForm from "../../components/admin/MovieForm";
import { adminApi } from "../../Services/adminApi";
import { useNavigate } from "react-router-dom";

export default function AddMovie() {
    const navigate = useNavigate();

    const handleAdd = async (data: any) => {
        try {
            await adminApi.addMovie(data);
            alert("Film berhasil ditambahkan!");
            navigate("/admin/movies");
        } catch (err) {
            alert("Gagal menambahkan film");
            console.error(err);
        }
    };

    return <MovieForm onSubmit={handleAdd} />;
}
