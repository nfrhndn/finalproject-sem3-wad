import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Film from "./pages/Film";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Tiket from "./pages/Tiket";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AddMovie from "./pages/admin/AddMovie";
import EditMovie from "./pages/admin/EditMovie";
import ManageTickets from "./pages/admin/ManageTickets";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";

// ✅ Import proteksi admin
import AdminRoute from "./components/AdminRoute";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tambahkan "/admin/login" ke daftar halaman autentikasi
  const isAuthPage = ["/login", "/register", "/admin/login"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");
  const hideLayout = isAuthPage || isAdminPage;

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}

      <main
        className={`flex-grow ${isAuthPage
          ? "bg-gradient-to-r from-cyan-500 to-blue-600"
          : "bg-white"
          }`}
      >
        {/* Tombol kembali di halaman login/register/admin-login */}
        {isAuthPage && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-4 text-white font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
        )}

        <Routes>
          {/* ================= USER ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/film" element={<Film />} />
          <Route path="/film/:id" element={<Film />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/:movieId" element={<Checkout />} />
          <Route path="/tiket" element={<Tiket />} />
          <Route path="/profile" element={<Profile />} />

          {/* ================= ADMIN LOGIN (tanpa proteksi) ================= */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ================= ADMIN ROUTES (dilindungi) ================= */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="movies/add" element={<AddMovie />} />
            <Route path="movies/edit/:id" element={<EditMovie />} />
            <Route path="tickets" element={<ManageTickets />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
