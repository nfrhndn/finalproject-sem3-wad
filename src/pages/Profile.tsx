import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    avatar: "",
    language: "id",
    favoriteGenre: "",
    favoriteStudio: "",
    notifications: {
      email: true,
      sms: false,
    },
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: target.checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Perubahan berhasil disimpan (simulasi)");
  };

  const handleDeleteAccount = () => {
    if (confirm("Apakah kamu yakin ingin menghapus akun?")) {
      logout(); 
      alert("🚫 Akun dihapus (simulasi)");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">Profil Saya</h1>

      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-lg shadow">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">No. Telepon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Avatar (URL)</label>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bahasa</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Genre Favorit</label>
            <input
              type="text"
              name="favoriteGenre"
              value={formData.favoriteGenre}
              onChange={handleChange}
              placeholder="Misal: Aksi, Komedi"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Studio Favorit</label>
            <input
              type="text"
              name="favoriteStudio"
              value={formData.favoriteStudio}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notifikasi
          </label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="email"
                checked={formData.notifications.email}
                onChange={handleChange}
              />
              Email
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="sms"
                checked={formData.notifications.sms}
                onChange={handleChange}
              />
              SMS
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password Baru
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-8 right-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Konfirmasi Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-cyan-600 text-white px-5 py-2 rounded-lg hover:bg-cyan-700"
          >
            Simpan Perubahan
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="text-red-600 hover:underline text-sm"
          >
            Hapus Akun
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
