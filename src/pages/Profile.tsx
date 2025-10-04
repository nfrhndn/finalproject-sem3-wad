import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Upload, User } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    gender: "",
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("profileData");
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    } else if (user) {
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
    localStorage.setItem("profileData", JSON.stringify(formData));
    setIsEditing(false);
    alert("✅ Perubahan berhasil disimpan");
  };

  const handleDeleteAccount = () => {
    if (confirm("Apakah kamu yakin ingin menghapus akun?")) {
      logout();
      localStorage.removeItem("profileData");
      alert("🚫 Akun dihapus");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <User className="text-cyan-700" size={28} />
          <h1 className="text-3xl font-bold text-cyan-700">
            Informasi Profil
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          {isEditing ? "Batal" : "Ubah"}
        </button>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6 bg-white p-6 rounded-xl shadow-lg"
      >

        <div className="flex justify-center">
          <div className="relative w-28 h-28">
            <img
              src={
                formData.avatar ||
                "https://www.gravatar.com/avatar/?d=mp&f=y"
              }
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
            />
            {isEditing && (
              <label
                htmlFor="avatarUpload"
                className="absolute bottom-0 right-0 bg-cyan-600 p-2 rounded-full cursor-pointer hover:bg-cyan-700 text-white"
              >
                <Upload size={16} />
              </label>
            )}
            <input
              type="file"
              id="avatarUpload"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const imageURL = URL.createObjectURL(file);
                  setFormData((prev) => ({ ...prev, avatar: imageURL }));
                }
              }}
            />
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              No. Telepon
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jenis Kelamin
            </label>
            <div className="mt-1 flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Laki-Laki"
                  checked={formData.gender === "Laki-Laki"}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                Laki-Laki
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Perempuan"
                  checked={formData.gender === "Perempuan"}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                Perempuan
              </label>
            </div>
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
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 pr-10 disabled:bg-gray-100"
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-8 right-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Konfirmasi Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 pr-10 disabled:bg-gray-100"
            />
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute top-8 right-3 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-cyan-600 text-white px-5 py-2 rounded-lg hover:bg-cyan-700 transition"
            >
              Simpan
            </button>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="text-red-600 hover:underline text-sm"
            >
              Hapus Akun
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
