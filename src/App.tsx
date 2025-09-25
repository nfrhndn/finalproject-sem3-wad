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

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hideLayout = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}

      <main
        className={`flex-grow ${
          hideLayout ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-white"
        }`}
      >
        {hideLayout && (
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
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/film/:id" element={<Film />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
