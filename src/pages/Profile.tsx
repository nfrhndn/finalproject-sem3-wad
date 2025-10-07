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
  X,
  ChevronDown,
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
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Bahasa Indonesia");
  const [showLangDropdown, setShowLangDropdown] = useState(false);


  const storageKey = user ? `profileData_${user.email}` : null;

  useEffect(() => {
    if (!user) return;
    const saved = storageKey ? localStorage.getItem(storageKey) : null;
    if (saved) {
      setFormData(JSON.parse(saved));
    } else {
      setFormData({
        avatar: "",
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user, storageKey]);

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
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(formData));
    setIsEditing(false);
    alert("✅ Profil berhasil diperbarui!");
  };

  const handleCancel = () => setIsEditing(false);
  const handleDeleteAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: "" }));
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify({ ...formData, avatar: "" }));
    }
  };

  const paymentOptions = [
    {
      category: "Bank",
      options: [
        { name: "Mandiri", icon: "/src/icons/mandiri.png" },
        { name: "BNI", icon: "/src/icons/bni.png" },
        { name: "Permata Bank", icon: "/src/icons/permata.png" },
        { name: "Bank BRI", icon: "/src/icons/bri.png" },
      ],
    },
    {
      category: "E-Wallet",
      options: [
        { name: "Gopay", icon: "/src/icons/gopay.png" },
        { name: "Dana", icon: "/src/icons/dana.png" },
        { name: "Ovo", icon: "/src/icons/ovo.png" },
      ],
    },
  ];

  const handleConnectPayment = () => {
    if (!selectedPayment) return;
    alert(`✅ ${selectedPayment} berhasil dihubungkan ke akun Anda`);
    setActiveModal(null);
  };

  const languageOptions = [
    { name: "Bahasa Indonesia", flag: "/src/icons/indonesia.svg" },
    { name: "English", flag: "/src/icons/english.svg" },
  ];


  const Modal = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-cyan-700 transition"
          onClick={() => setActiveModal(null)}
        >
          <X size={22} />
        </button>
        <h2 className="text-xl font-semibold text-cyan-700 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );

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
                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(formData.name || user?.name || "U")
              )}
            </div>
            {isEditing && (
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-cyan-600 p-1.5 rounded-full cursor-pointer hover:bg-cyan-700 text-white shadow-md z-10"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nama"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Email"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-9 right-3 text-gray-500 hover:text-cyan-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-between items-center mt-5">
                  {formData.avatar && (
                    <button onClick={handleDeleteAvatar} className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm">
                      <Trash2 size={16} />
                      Hapus Foto
                    </button>
                  )}
                  <div className="flex gap-4 ml-auto">
                    <button onClick={handleCancel} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                      Batal
                    </button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700">
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                  <h2 className="text-lg font-semibold text-gray-800">{formData.name || user?.name}</h2>
                  <p className="text-sm text-gray-500">{formData.email || user?.email}</p>
              </>
            )}
          </div>
          {!isEditing && (
            <button className="p-2 ml-4 text-gray-500 hover:text-cyan-700" onClick={() => setIsEditing(true)}>
              <Edit2 size={20} />
            </button>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={() => setActiveModal("payment")}
            className="w-full flex justify-between items-center border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="text-cyan-600" size={20} />
              <span className="text-gray-800 font-medium">Metode Pembayaran</span>
            </div>
            {selectedPayment ? (
              <img
                src={
                  paymentOptions
                    .flatMap((cat) => cat.options)
                    .find((opt) => opt.name === selectedPayment)?.icon
                }
                alt={selectedPayment}
                className="w-16 h-7 object-contain"
              />
            ) : (
              <span className="text-gray-400 text-sm">Atur kartu dan e-wallet</span>
            )}
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-gray-500 text-sm font-semibold mb-3 uppercase">Pengaturan</h3>
          <div className="space-y-2">
            <button onClick={() => setActiveModal("security")} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50">
              <Shield className="text-cyan-600" size={20} />
              <span className="text-gray-700">Keamanan Akun</span>
            </button>
            <button
              onClick={() => setActiveModal("language")}
              className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Globe className="text-cyan-600" size={20} />
                <span className="text-gray-700">Bahasa</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={languageOptions.find((lang) => lang.name === selectedLanguage)?.flag}
                  alt={selectedLanguage}
                  className="w-6 h-4 object-contain rounded-sm"
                />
                <span className="text-sm text-gray-600">{selectedLanguage}</span>
              </div>
            </button>


          </div>
        </div>

        <div>
          <h3 className="text-gray-500 text-sm font-semibold mb-3 uppercase">Lainnya</h3>
          <div className="space-y-2">
            <button onClick={() => setActiveModal("terms")} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50">
              <FileText className="text-cyan-600" size={20} />
              <span className="text-gray-700">Ketentuan Penggunaan</span>
            </button>
            <button onClick={() => setActiveModal("help")} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50">
              <HelpCircle className="text-cyan-600" size={20} />
              <span className="text-gray-700">Pusat Bantuan</span>
            </button>
          </div>
        </div>
      </div>

      {activeModal === "payment" && (
        <Modal title="Metode Pembayaran">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex justify-between items-center border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50"
            >
              {selectedPayment ? (
                <span className="flex items-center gap-2">
                  <img
                    src={
                      paymentOptions
                        .flatMap((cat) => cat.options)
                        .find((opt) => opt.name === selectedPayment)?.icon
                    }
                    alt={selectedPayment}
                    className="w-20 h-8 object-contain"
                  />
                </span>
              ) : (
                <span>Pilih Metode Pembayaran</span>
              )}
              <ChevronDown className="w-5 h-5" />
            </button>

            {showDropdown && (
              <div className="mt-2 border border-gray-300 rounded-lg bg-white shadow p-3 space-y-4">
                {paymentOptions.map((group) => (
                  <div key={group.category}>
                    <p className="text-sm font-semibold text-gray-600 mb-2">{group.category}</p>
                    <div className="grid gap-3 grid-cols-2">
                      {group.options.map((opt) => (
                        <button
                          key={opt.name}
                          onClick={() => {
                            setSelectedPayment(opt.name);
                            setShowDropdown(false);
                          }}
                          className="flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 w-full h-14"
                        >
                          <img src={opt.icon} alt={opt.name} className="max-h-10 object-contain" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleConnectPayment}
            disabled={!selectedPayment}
            className={`w-full mt-5 px-4 py-3 rounded-lg font-medium shadow ${selectedPayment
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Hubungkan
          </button>
        </Modal>
      )}

      {activeModal === "security" && (
        <Modal title="Keamanan Akun">
          <div className="space-y-3">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="w-full flex justify-between items-center border border-gray-300 rounded-lg px-4 py-3 text-left hover:bg-cyan-50"
            >
              <span>Hapus Akun</span>
              <ChevronDown className={`w-5 h-5 transform transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>

            {showDropdown && (
              <div className="border border-gray-200 rounded-lg p-4 mt-2 bg-gray-50 space-y-3 text-sm text-gray-700">
                <p className="text-gray-700">
                  1. Customer Service kami akan menghubungi Anda melalui email terdaftar untuk memverifikasi permintaan penghapusan akun.
                  <br />2. Proses penghapusan akun memakan waktu maksimal 14 hari kerja.
                  <br />3. Setelah penghapusan selesai, akun tidak dapat digunakan kembali untuk pendaftaran.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tulis detailnya
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan alasan atau detail penghapusan akun Anda..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  ></textarea>
                </div>

                <button
                  onClick={() => {
                    alert("✅ Laporan penghapusan akun telah dikirim ke tim kami.");
                    setShowDropdown(false);
                  }}
                  className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-medium py-2.5 rounded-lg shadow"
                >
                  Kirim laporan
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}


      {activeModal === "language" && (
        <Modal title="Pilih Bahasa">
          <div className="space-y-3">
            {languageOptions.map((lang) => (
              <button
                key={lang.name}
                onClick={() => {
                  setSelectedLanguage(lang.name);
                  setActiveModal(null);
                  alert(`🌐 Bahasa diubah ke ${lang.name}`);
                }}
                className={`w-full flex items-center justify-between border border-gray-300 rounded-lg px-4 py-2 hover:bg-cyan-50 ${selectedLanguage === lang.name ? "bg-cyan-100 border-cyan-400" : ""
                  }`}
              >
                <span className="flex items-center gap-2">
                  <img src={lang.flag} alt={lang.name} className="w-6 h-4 object-contain" />
                  {lang.name}
                </span>
                {selectedLanguage === lang.name && <span className="text-cyan-600 font-medium">Dipilih</span>}
              </button>
            ))}
          </div>
        </Modal>
      )}



      {activeModal === "terms" && (
        <Modal title="Ketentuan Penggunaan CinemaPlus">
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              Dengan menggunakan situs <b>CinemaPlus</b>, Anda menyetujui ketentuan yang berlaku.
            </p>
            <p>
              Data film, jadwal, dan gambar adalah milik <b>CinemaPlus</b> atau pemegang hak sahnya.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Dilarang menggunakan data ini untuk tujuan komersial tanpa izin.</li>
              <li>Dilarang menyalin atau membagikan isi situs tanpa izin.</li>
              <li>Dilarang menjual atau menyewakan data situs kepada pihak lain.</li>
            </ul>
            <p>
              <b>CinemaPlus</b> dapat memperbarui ketentuan ini sewaktu-waktu. Periksa versi terbaru secara berkala.
            </p>
          </div>
        </Modal>
      )}

      {activeModal === "help" && (
        <Modal title="Pusat Bantuan">
          <p className="text-sm text-gray-600">Jika Anda mengalami kendala, hubungi kami melalui:</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>📞 Call Center: 081234567899</li>
            <li>✉️ Email: cinemaplus@gmail.com</li>
          </ul>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
