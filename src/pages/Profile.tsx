import { useState, useEffect } from "react";
import {
  User,
  CreditCard,
  Globe,
  Shield,
  FileText,
  HelpCircle,
  Edit2,
  Upload,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    avatar: "",
    name: "",
    email: "",
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("profileData");
    if (saved) {
      setFormData(JSON.parse(saved));
    } else if (user) {
      setFormData({
        avatar: "",
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files && files[0]) {
      const imgURL = URL.createObjectURL(files[0]);
      setFormData((prev) => ({ ...prev, avatar: imgURL }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    localStorage.setItem("profileData", JSON.stringify(formData));
    setIsEditing(false);
    alert("✅ Profil berhasil diperbarui!");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDeleteAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: "" }));
    localStorage.setItem(
      "profileData",
      JSON.stringify({ ...formData, avatar: "" })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-cyan-50 flex flex-col items-center py-10 px-4">
      
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2">
          <User className="text-cyan-700" size={28} />
          <h1 className="text-3xl font-bold text-cyan-700">Informasi Profil</h1>
        </div>
      </div>

      
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl">
        <div className="flex items-start justify-between mb-6">
          
          <div className="relative w-20 h-20 flex-shrink-0">
            <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden flex items-center justify-center bg-cyan-700 text-white text-2xl font-bold uppercase">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(formData.name || user?.name || "U")
              )}
            </div>

            
            {isEditing && (
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-cyan-600 p-1.5 rounded-full cursor-pointer hover:bg-cyan-700 text-white shadow-md z-10"
                title="Upload avatar"
              >
                <Upload size={14} />
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
            )}
          </div>

          
          <div className="flex-grow ml-5">
            {isEditing ? (
              <div className="bg-gray-50 p-6 rounded-lg space-y-5 shadow-inner">
                
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    placeholder="Nama"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    placeholder="Email"
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password Baru
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-9 right-3 text-gray-500 hover:text-cyan-700 transition"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="flex justify-between items-center mt-5">
                  {formData.avatar && (
                    <button
                      onClick={handleDeleteAvatar}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition text-sm"
                    >
                      <Trash2 size={16} />
                      Hapus Foto
                    </button>
                  )}

                  <div className="flex gap-4 ml-auto">
                    <button
                      onClick={handleCancel}
                      className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-5 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800">
                  {formData.name || user?.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {formData.email || user?.email}
                </p>
              </>
            )}
          </div>

          {!isEditing && (
            <button
              className="p-2 ml-4 text-gray-500 hover:text-cyan-700 transition"
              onClick={() => setIsEditing(true)}
              aria-label="Edit profile"
            >
              <Edit2 size={20} />
            </button>
          )}
        </div>

        <div className="mb-6">
          <button className="w-full flex justify-between items-center border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <CreditCard className="text-cyan-600" size={20} />
              <span className="text-gray-800 font-medium">
                Metode Pembayaran
              </span>
            </div>
            <span className="text-gray-400 text-sm">
              Atur kartu dan e-wallet
            </span>
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-gray-500 text-sm font-semibold mb-3 uppercase">
            Pengaturan
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition">
              <Shield className="text-cyan-600" size={20} />
              <span className="text-gray-700">Keamanan Akun</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition">
              <Globe className="text-cyan-600" size={20} />
              <span className="text-gray-700">Bahasa</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-gray-500 text-sm font-semibold mb-3 uppercase">
            Lainnya
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition">
              <FileText className="text-cyan-600" size={20} />
              <span className="text-gray-700">Syarat Penggunaan</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition">
              <HelpCircle className="text-cyan-600" size={20} />
              <span className="text-gray-700">Pusat Bantuan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
