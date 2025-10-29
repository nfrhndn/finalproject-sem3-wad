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
import ManageMovies from "./pages/admin/ManageMovies";
import ManageTickets from "./pages/admin/ManageTickets";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminLayout from "./layouts/AdminLayout";

import AdminRoute from "./components/AdminRoute";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="movies" element={<ManageMovies />} />  
            <Route path="tickets" element={<ManageTickets />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
