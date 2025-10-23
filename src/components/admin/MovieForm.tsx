// src/components/admin/MovieForm.tsx
import { useState } from "react";
import type { FormEvent } from "react";


interface MovieFormProps {
    initialData?: {
        title: string;
        genre: string;
        duration: number;
        release_date: string;
    };
    onSubmit: (data: any) => Promise<void>;
    isEdit?: boolean;
}

export default function MovieForm({ initialData, onSubmit, isEdit }: MovieFormProps) {
    const [form, setForm] = useState(
        initialData || { title: "", genre: "", duration: 0, release_date: "" }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit(form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-xl p-6 max-w-lg mx-auto space-y-4"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {isEdit ? "Edit Film" : "Tambah Film"}
            </h2>

            <div>
                <label className="block mb-1 font-medium">Judul Film</label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Genre</label>
                <input
                    type="text"
                    name="genre"
                    value={form.genre}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Durasi (menit)</label>
                <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Tanggal Rilis</label>
                <input
                    type="date"
                    name="release_date"
                    value={form.release_date}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700 transition"
            >
                {isEdit ? "Simpan Perubahan" : "Tambah Film"}
            </button>
        </form>
    );
}
